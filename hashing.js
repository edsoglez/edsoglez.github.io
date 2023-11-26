export function hashing(string) {
    //set variable hash as 0
    var hash = 0;
    // if the length of the string is 0, return 0
    if (string.length == 0) return hash;
    
    for (let i = 0 ;i<string.length ; i++)
    {
        let ch = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + ch;
        hash = hash & hash;
    }

    let abshash = String(Math.abs(Number(hash)))
    abshash = abshash + (abshash.split("").reverse().join(""))
    var hash3 = "";

    for (let i = 0 ; i<abshash.length; i=i+2)
    {
        let ch2 = String(abshash).charAt(i)+String(abshash).charAt(i+1);
        let ch3 = 0;
        Number(ch2)< 94 ? ch3 = String.fromCharCode(Number(ch2)+33) : ch3 = String.fromCharCode(Number(ch2))
        hash3 = hash3 + ch3;
    }
    return hash3;
}