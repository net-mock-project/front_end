import { useEffect, useRef } from "react";
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
    const lastSentLocation = useRef<{ latitude: number; longitude: number; sentAt: number } | null>(null);

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

        startConnection();

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

    const sendLocation = async (latitude: number,longitude: number) => {
        if (locationHub.state !== "Connected") {
            console.warn("Location Hub is not connected");
            return;
        }

        const previous = lastSentLocation.current;
        const now = Date.now();
        const hasSmallMovement = previous &&
            Math.abs(previous.latitude - latitude) < 0.0001 &&
            Math.abs(previous.longitude - longitude) < 0.0001;

        if (previous && (now - previous.sentAt < 10000 || hasSmallMovement)) {
            return;
        }

        try {
            await locationHub.invoke(
                "UpdateLocation",
                latitude,
                longitude
            );

            lastSentLocation.current = {
                latitude,
                longitude,
                sentAt: now,
            };

            console.log("Location sent:", {
                latitude,
                longitude,
            });
        } catch (error) {
            console.error("Failed to send location:", error);
        }
    };

    return {
        sendLocation,
    };
};