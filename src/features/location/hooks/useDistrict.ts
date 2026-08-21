import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useQuery } from "@tanstack/react-query";
import { getDistrict } from "../api/geocoding";


export function useDistrict(
  latitude?: number,
  longitude?: number
) {
  const geocodingLibrary = useMapsLibrary("geocoding");

  return useQuery({
    queryKey: ["district", latitude, longitude],

    queryFn: async () => {
      if (!geocodingLibrary) {
        throw new Error("Google Geocoding library is not loaded");
      }

      const geocoder = new geocodingLibrary.Geocoder();

      return getDistrict(
        geocoder,
        latitude!,
        longitude!
      );
    },

    enabled:
      !!geocodingLibrary &&
      latitude != null &&
      longitude != null,
  });
}