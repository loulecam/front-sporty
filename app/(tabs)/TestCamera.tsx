import { Camera } from '@scottjgilroy/react-native-vision-camera-v4-pose-detection';
import { useCameraDevices } from "react-native-vision-camera";
import React, { useState, useEffect, useRef } from "react";
import { View } from 'react-native';

const [pose,setPose] = useState(null)

console.log(pose)



export default function TestCamera({ navigation }) {
    const devices = useCameraDevices()
    const device = devices.back;
    return (
        <View>
            <Camera
            // optional
            options={{
                mode: "stream",
                performanceMode:"max"
                }}
            
            device={device}
            callback={(data) => setPose(data)}
            {...props}
            />
        </View>
    );

}

