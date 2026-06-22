const name = "Kr$na";
const query = "krsna";
const cleanName = name.toLowerCase().replace(/\$/g, 's').replace(/[^a-z0-9]/g, '');
const cleanQuery = query.toLowerCase().replace(/\$/g, 's').replace(/[^a-z0-9]/g, '');
console.log("cleanName:", cleanName);
console.log("cleanQuery:", cleanQuery);
console.log("match:", cleanName.includes(cleanQuery));
