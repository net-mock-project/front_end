import { useCallback, useEffect, useRef } from "react";
import { locationHub } from "../services/locationHub";
import { useQueryClient } from "@tanstack/react-query";
import type { Volunteer } from "../../../types/Volunteer";

interface LocationUpdated {
    userId: string;
    latitude: number;
    longitude: number;
    updatedAt: string;
}

export const useLocationHub = () => {
    const queryClient = useQueryClient();
    const connectionPromiseRef = useRef<Promise<void> | null>(null);

    useEffect(() => {
        const startConnection = async () => {
            if (locationHub.state !== "Disconnected") {
                return;
            }

            try {
                await locationHub.start();
                console.log("Location Hub connected");
            } catch (error) {
                console.error(
                    "Failed to connect to Location Hub:",
                    error
                );
            }
        };

        const handleLocationUpdated = (
            data: LocationUpdated
        ) => {
            console.log("Location updated:", data);

            queryClient.setQueryData<Volunteer[]>(
                ["volunteers"],
                (old) => {
                    if (!old) {
                        return old;
                    }

                    return old.map((volunteer) =>
                        volunteer.id === data.userId
                            ? {
                                  ...volunteer,
                                  latitude: data.latitude,
                                  longitude: data.longitude,
                              }
                            : volunteer
                    );
                }
            );
        };

        connectionPromiseRef.current = startConnection();

        locationHub.on(
            "UserLocationUpdated",
            handleLocationUpdated
        );

        return () => {
            locationHub.off(
                "UserLocationUpdated",
                handleLocationUpdated
            );
        };
    }, [queryClient]);

    const sendLocation = useCallback(async (latitude: number, longitude: number) => {
        try {
            if (locationHub.state === "Disconnected") {
                await locationHub.start();
            } else if (locationHub.state === "Connecting") {
                await connectionPromiseRef.current;
            }

            if (locationHub.state !== "Connected") {
                return;
            }

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
    }, []);

    return {
        sendLocation,
    };
};