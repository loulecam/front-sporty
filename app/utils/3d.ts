import { loadObjAsync, loadTextureAsync, THREE } from "expo-three";
import { resolveAsync } from "expo-asset-utils";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationMixer } from "three";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

async function loadFileAsync({
  asset,
  funcName,
}: {
  asset: any;
  funcName: string;
}) {
  if (!asset) {
    throw new Error(`ExpoTHREE.${funcName}: Cannot parse a null asset`);
  }
  return (await resolveAsync(asset)).localUri ?? null;
}

export async function loadFbxAsync({
  asset,
  onAssetRequested,
}: {
  asset: any;
  onAssetRequested?: any;
}) {
  const uri = await loadFileAsync({
    asset,
    funcName: "loadFbxAsync",
  });
  if (!uri) return;
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const arrayBuffer = decode(base64);
  const loader = new FBXLoader();
  return loader.parse(arrayBuffer, onAssetRequested);
}
export async function loadGLTFAsync({
  asset,
  onAssetRequested,
}: {
  asset: any;
  onAssetRequested?: any;
}) {
  const uri = await loadFileAsync({
    asset,
    funcName: "loadGLTFAsync",
  });
  if (!uri) return;
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const arrayBuffer = decode(base64);
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.parse(
      arrayBuffer,
      onAssetRequested,
      (result) => {
        resolve(result);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

export const loadModel = async function (item: any) {
  const texturesLength = item.textures?.length || 0;
  console.log(`[loadModel] -> Textures length: ${texturesLength}`);
  const textures: any[] = [];
  for (let i = 0; i < texturesLength; i++) {
    const texture = await loadTextureAsync({
      asset: item.textures[i].image,
    });
    if (item.type === "glb") {
      texture.flipY = false;
    }
    textures.push({ name: item.textures[i]?.name || "-", map: texture });
  }
  console.log(`[loadModel] -> Textures done loading`);

  let obj = null;
  let mixer = null;
  let animations = [];

  if (item.type === "obj") {
    obj = await loadObjAsync({
      asset: item.model,
      mtlAsset: item?.material || undefined,
    });
  } else if (item.type === "fbx") {
    obj = await loadFbxAsync({ asset: item.model });
    if (obj.animations && obj.animations.length > 0) {
      animations = obj.animations;
      mixer = new AnimationMixer(obj); // Crée un mixer pour gérer les animations
    }
  } else if (item.type === "gltf" || item.type === "glb") {
    const result: any = await loadGLTFAsync({ asset: item.model });
    console.log(result);
    obj = result.scene;
    if (result.animations && result.animations.length > 0) {
      animations = result.animations;
      mixer = new AnimationMixer(obj); // Crée un mixer pour gérer les animations
    }
  }

  console.log(`[loadModel] -> Model done loading, adding textures now...`);

  if (texturesLength > 0) {
    if (texturesLength === 1) {
      obj.traverse(function (object: any) {
        if (object instanceof THREE.Mesh) {
          object.material.map = textures[0]?.map;
        }
      });
    } else {
      obj.traverse(function (object: any) {
        if (object instanceof THREE.Mesh) {
          const selected = textures?.find((x) => x.name === object.name);
          object.material.map = selected?.map;
        }
      });
    }
  }
  console.log(`[loadModel] -> Textures done applied...`);

  if (item.scale) {
    obj.scale.set(item.scale.x, item.scale.y, item.scale.z);
  }
  if (item.position) {
    obj.position.set(item.position.x, item.position.y, item.position.z);
  }
  if (item.rotation) {
    obj.rotation.x = item.rotation.x;
    obj.rotation.y = item.rotation.y;
    obj.rotation.z = item.rotation.z;
  }

  return { obj, mixer, animations }; // Retourne le modèle, le mixer et les animations
};
