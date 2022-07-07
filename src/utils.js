
/**
 * 
 * @param {string} url Location of data 
 * @returns 
 */
export async function getData(url) {
    let response = await fetch(url);
    let json = await response.json();
    return json;
  }