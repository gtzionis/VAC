let refData
setTimeout( async () =>{
    const response = await fetch('/refugees')
    refData = await response.json()
    //console.log(refData)
}, 1)
/////////θα δημιουρησωτις συναρτησεις και θα τις καλεσω στο chart production
setTimeout(async () =>{ 
    const response = await fetch('/data')
    data = await response.json()
    //console.log(data) 
}, 1);