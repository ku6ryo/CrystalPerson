import { BufferGeometry, Float32BufferAttribute, BufferAttribute } from "three";

export function generateCrystalGeometry(corners: number, radius: number): BufferGeometry {
  const numVerts = 2 * corners + 2
  const geometry = new BufferGeometry();
  const vertices = new Float32Array(numVerts * 3)

  let index = 0
  vertices[index++] = 0;
  vertices[index++] = 0;
  vertices[index++] = 2;

  for (let i = 0; i < corners; i++) {
    vertices[index++] = radius * Math.cos(i * 2 * Math.PI / (corners - 1));
    vertices[index++] = radius * Math.sin(i * 2 * Math.PI / (corners - 1));
    vertices[index++] = 1;
  }
  for (let i = 0; i < corners; i++) {
    vertices[index++] = radius * Math.cos(i * 2 * Math.PI / (corners - 1));
    vertices[index++] = radius * Math.sin(i * 2 * Math.PI / (corners - 1));
    vertices[index++] = -1;
  }
  vertices[index++] = 0;
  vertices[index++] = 0;
  vertices[index++] = -2;

  const triangles: number[] = []
  for (let i = 1; i < corners; i++) {
    triangles.push(0, i, i + 1);
  }
  triangles.push(0, corners, 1);
  for (let i = 1; i < corners; i++) {
    triangles.push(i + 1, i, i + corners);
    triangles.push(i + 1, i + corners, i + corners + 1);
  }
  triangles.push(1, corners, 1 + corners);
  triangles.push(corners, 2 * corners, 1 + corners);

  for (let i = corners + 1; i < numVerts - 2; i++) {
    triangles.push(numVerts - 1, i + 1, i);
  }
  triangles.push(numVerts - 1, corners + 1, 2 * corners);


  const uvs: number[] = []
  uvs.push(0.5, 0)
  for (let i = 0; i < corners; i++) {
    uvs.push(i / (corners - 1), 0.25);
  }
  for (let i = 0; i < corners; i++) {
    uvs.push(i / (corners - 1), 0.75);
  }
  uvs.push(0.5, 1)

  console.log(uvs)



  console.log(vertices)
  console.log(triangles)

  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(new Float32Array(uvs), 2))
  geometry.setIndex(triangles);

  geometry.computeVertexNormals()

  return geometry;
}