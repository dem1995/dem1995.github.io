function createPolygon(centX, centY, numSides, radius)
{
	var vertices = [];
	var counter;

	for (counter = 0; counter < numSides; counter++)
	{
		const side_angle = Math.PI * 2 / numSides;
		vertices.push(centX + Math.cos(counter * side_angle)*radius);
		vertices.push(centY + Math.sin(counter * side_angle)*radius);
	}

	return vertices;
}