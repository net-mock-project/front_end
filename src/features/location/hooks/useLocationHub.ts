import { useEffect } from "react";
import { locationHub } from "../services/locationHub";


export const useLocationHub = () => {
    useEffect(() => {
        const startConnection = async () => {
            if (locationHub.state !== "Disconnected") {
                return;
            }

            try {
                await locationHub.start();
                console.log("Location Hub connected");
            } catch (error) {
                console.error("Failed to connect to Location Hub:", error);
            }
        };

        startConnection();

        return () => {
           
        };
    }, []);

    const sendLocation = async (
        latitude: number,
        longitude: number
    ) => {
        if (locationHub.state !== "Connected") {
            console.warn("Location Hub is not connected");
            return;
        }

        try {
            await locationHub.invoke(
                "UpdateLocation",
                latitude,
                longitude
            );

            console.log("Location sent:", {
                latitude,
                longitude,
            });
        } catch (error) {
            console.error("Failed to send location:", error);
        }
    };

    return {
        locationHub,
        sendLocation,
    };
};