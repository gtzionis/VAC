let manipulationOfGroups = (groupData) => {
    $.fn.dataTable.ext.errMode = 'none'
    //take all the solutions
    let solutionsData = groupData[0].Solutions
    //Max number of groups
    let maxGroups = Math.max(...solutionsData.map(element => element.Members.length))
    let nameGroups = []

    for (let index = 1; index <= maxGroups; index++) {
        nameGroups[index-1] = 'Group ' +index 
    }

    let membersData = solutionsData.map(obj => obj.Members)
    let agentsData = []
    membersData.forEach((element,index) => {
        agentsData[index] = element.map(obj => obj.Agents) 
    });
    //find the solution and group correlation but as one instance
    let namesData = []
    agentsData.forEach((group,index1) => {
        group.forEach((agentGroup,index2) => {
            agentGroup.forEach((element,index3) => {
                let ind = {
                    solution: index1,
                    group: index2,
                    name: TCNData.find(obj => obj.agentId == element.replaceAll('"','')).Name,
                    agent: element.replaceAll('"',''),
                    withDbquets: element
                }
                namesData.push(ind)
            });
        });
    });
    //join the names in one row
    let mergeData = []
    for (let index1 = 0; index1 < solutionsData.length; index1++) {
        for (let index2 = 0; index2 < nameGroups.length; index2++) {
            if(namesData.find(obj => obj.solution == index1 && obj.group == index2)){
                let ind = {
                    solution: `Solution ${index1+1}`,
                    group: `Group ${index2+1}`,
                    name: (namesData.filter(obj => obj.solution == index1 && obj.group == index2)).map(obj => obj.name).join(", "),
                    agent: (namesData.filter(obj => obj.solution == index1 && obj.group == index2)).map(obj => obj.agent).join(", "),
                    LCCUri: groupData[0].LCCUri,
                    hasId:groupData[0].hasId,
                    withDbquets: (namesData.filter(obj => obj.solution == index1 && obj.group == index2)).map(obj => obj.withDbquets).join(", ")
                }
                mergeData.push(ind)
            }
        }
    }
    
    document.querySelector('#tables').insertAdjacentHTML('beforeend',
    `<table id="tableOfGroups" class="display" style="width:100%; top:1rem;">
                        
    </table>
    `
    )
    
      $('#tableOfGroups').DataTable( {
        data: mergeData,
        columns: [
            {
                title:"Solution",
                data:"solution"
            },
            { 
                title: "Groups",
                data:"group"
            },
            {
                title:"Members",
                data:"name"
            }
        ]
      });

      document.querySelector('#buttonsFilters').insertAdjacentHTML('beforeend',`
        <div class="check-col-1 mt-2" style="border-top:1px solid black;">
            <div id="solutionSel" pt-2">
                
            </div>
            <div style="border-top:1px solid black;"><button id="finishCoordination" class="btn btn-light mt-2">Finish</button></div>
        </div>
      `)

      solutionsData.forEach((element,index) => {
        document.querySelector('#solutionSel').insertAdjacentHTML('beforeend',`
        <div class="custom-control custom-radio custom-control-inline">
            <input type="radio" class="custom-control-input" id="radiSol${index+1}" name="radio-sel" value="Solution ${index+1}">
            <label class="custom-control-label" for="radiSol${index+1}" value="Solution ${index+1}">Solution ${index+1}</label>
        </div>
        `
        )
      });

      document.querySelector('#finishCoordination').addEventListener('click', async () =>{
          //console.log(mergeData.filter(obj => obj.solution == document.querySelector('input[name="radio-sel"]:checked').value))
          let finalSolution = mergeData.filter(obj => obj.solution == document.querySelector('input[name="radio-sel"]:checked').value)
          let nodes = ''
          let nodesGroup = ''

          finalSolution.forEach((element,index) => {
              nodes=nodes+`_:bnode${index+2},`
              nodesGroup=nodesGroup+`_:bnode${index+2} rdf:type welcome:Group ; welcome:hasMembers ${element.withDbquets} .  `                                        
          });
          
          let finalStringSolution = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
                                    'PREFIX welcome: <https://raw.githubusercontent.com/gtzionis/WelcomeOntology/main/welcome.ttl#> '+
                                    'welcome:'+finalSolution[0].LCCUri+' rdf:type welcome:LCCUseCase; '+
                                    '                                 welcome:hasId "'+finalSolution[0].hasId+'"; '+
                                    '                                 welcome:hasFinalSolution _:bnode1 . '+
                                    '_:bnode1                          rdf:type welcome:Grouping ; '+
                                    '                                 welcome:hasSolutionOf welcome:'+finalSolution[0].LCCUri+' ; '+
                                    '                                 welcome:hasMembers  '+nodes.slice(0, -1)+' .'+
                                    ' '+nodesGroup+'  '

        fetch('/finalGroup', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'text/plain',
            },
            body: finalStringSolution ,
            redirect: 'follow'
            })
            .then(response => { return response.text()})
            .then(data => {
            //console.log(data);
            })
            .catch((error) => {
            console.error('Error:', error);
        });

        document.querySelector('#tables').innerHTML=''
        document.querySelector('#buttonsFilters').innerHTML=''

      })
      
}