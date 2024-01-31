export { randIndex };

//function that randomly selects words from each words array
//limits the nuber of calls to Math.random()
function randIndex(array){
    return array[Math.floor(Math.random() * array.length)]
}