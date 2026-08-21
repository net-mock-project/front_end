

export async function getDistrict(
  geocoder: google.maps.Geocoder,
  latitude: number,
  longitude: number
): Promise<string | null> {
  const { results } = await geocoder.geocode({
    location: {
      lat: latitude,
      lng: longitude,
    },
  });

  const component = results
    .flatMap(result => result.address_components)
    .find(component =>
      component.types.includes(
        "administrative_area_level_2"
      )
    );

  return component?.long_name ?? null;
}