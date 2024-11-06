class CoordinateGenerator {
    static generateCoordinates(radius, currentLocation) {
        const radiusInDegrees = radius / 111; 

        const latitude = currentLocation.latitude + (Math.random() - 0.5) * radiusInDegrees * 2;
        const longitude = currentLocation.longitude + (Math.random() - 0.5) * radiusInDegrees * 2;

        return { latitude, longitude };
    }

    // Haversine formula to calculate distance between two points
    static calculateDistance(start, end) {
        const R = 6371; // Radius of Earth in kilometers
        const dLat = (end.latitude - start.latitude) * (Math.PI / 180);
        const dLon = (end.longitude - start.longitude) * (Math.PI / 180);
        
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(start.latitude * (Math.PI / 180)) * Math.cos(end.latitude * (Math.PI / 180)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2); 
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        return R * c; // Distance in kilometers
    }
}

export default CoordinateGenerator;
