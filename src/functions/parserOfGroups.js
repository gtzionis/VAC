const groupTCN = require('../models/groupTCN')
const mongoose = require('mongoose')
let groupSchema = new mongoose.Schema({}, { strict: false });
let groupsTCN = mongoose.model('Group', groupSchema)


module.exports.parserOfGroups = (triples) => {
    let finalGroupObject = {
        LCCUri:"",
        hasId:"",
        DedicatedAgent:"",
        Status:"",
        Solutions:[]
    }
    let Solutions = []

    let LCCUseCase = triples.filter(obj => obj.object.includes('LCCUseCase'))
    let LCCUseCaseFields = triples.filter(obj => obj.subject == LCCUseCase[0].subject)
    finalGroupObject.LCCUri = LCCUseCase[0].subject.replace('https://raw.githubusercontent.com/gtzionis/WelcomeOntology/main/welcome.ttl#','')
    finalGroupObject.hasId = this.cleanTheString(LCCUseCaseFields.find(obj => obj.predicate.includes('hasId')).object)
    finalGroupObject.DedicatedAgent = this.cleanTheString(LCCUseCaseFields.find(obj => obj.predicate.includes('hasDedicatedAgent')).object)
    finalGroupObject.Status = this.cleanTheString(LCCUseCaseFields.find(obj => obj.predicate.includes('hasStatus')).object)

    let Grouping = triples.filter(obj => obj.object.includes('Grouping'))
    let GroupingFields = []
    for(let group=0;group<Grouping.length;group++){
        let objGr = {
            GroupingUri:"",
            Value:0,
            Rank:0,
            SolutionOf:"",
            Members:[]
        }
        GroupingFields[group]=triples.filter(obj => obj.subject.includes(Grouping[group].subject))
        objGr.GroupingUri = GroupingFields[group][0].subject.replace('http://localhost:8090/rdf4j/repositories/ajan_mac_ontology#','')
        objGr.Value = parseFloat(this.cleanTheString(GroupingFields[group].find(obj => obj.predicate.includes('hasValue')).object))
        objGr.Rank = parseFloat(this.cleanTheString(GroupingFields[group].find(obj => obj.predicate.includes('hasRank')).object))
        objGr.SolutionOf = this.cleanTheString(GroupingFields[group].find(obj => obj.predicate.includes('hasSolutionOf')).object).replace('https://raw.githubusercontent.com/gtzionis/WelcomeOntology/main/welcome.ttl#','')
        Solutions.push(objGr)
    }
    //console.log("Solutions ",Solutions)
    let Group = []
    let GroupFields = []
    let conactGroup = []
    for(let members=0;members<GroupingFields.length;members++){
        Group[members]=GroupingFields[members].filter(obj => obj.predicate.includes('hasMembers'))//παιρνεις τα coalition
        for(let participants=0;participants<Group[members].length;participants++){
            conactGroup.push(triples.filter(obj => obj.subject==Group[members][participants].object))
        }
    }
    
    //console.log('Group ',conactGroup)
    let lengthGroup = []
    Group.forEach(obj => {
        lengthGroup.push(obj.length)
    })
    console.log('length ',lengthGroup) // how many groups it has every solution
    let start=0
    for(let i=0;i<lengthGroup.length;i++){
           GroupFields.push(conactGroup.slice(start,lengthGroup[i]+start))
           start=start+lengthGroup[i]
    }
    //console.log('GroupFields ',GroupFields[2])
    for(let i=0;i<GroupFields.length;i++){
        let finGroup = []
        for(let j=0;j<GroupFields[i].length;j++){
                let groupAgents = []
                let objGr = {
                    GroupUri:"",
                    Agents:[]
                }
                groupAgents=GroupFields[i][j].filter(obj=> obj.predicate.includes('hasMembers'))
                //console.log(groupAgents.map(obj=> obj.object))
                finGroup=groupAgents.map(obj=> obj.object)
                objGr.GroupUri = GroupFields[i][j][0].subject.replace('https://raw.githubusercontent.com/gtzionis/WelcomeOntology/main/welcome.ttl#','')
                objGr.Agents = groupAgents.map(obj=> obj.object)

                Solutions[i].Members[j]=objGr
        }   
    }
    finalGroupObject.Solutions = Solutions
    //console.log(finalGroupObject.Solutions[2].Members)
    let GroupsTCN = new  groupsTCN(finalGroupObject)
    GroupsTCN.save()
    
}

module.exports.groupsTC = () => {
    groupsTCN.find({}).then((groupa) => {
        let objg = JSON.stringify(groupa[0])
        console.log(JSON.parse(objg))
        let objg2 = JSON.parse(objg)
        console.log(objg2.LCCUri)
        return objg2;
    }).catch((e) => {
       return 'nothing'
    })
}

module.exports.cleanTheString = (str) => {
    let finalStr = ""
    finalStr = str.replace(/["]+/g, '')
    if(finalStr.includes('float')){finalStr=finalStr.replace('^^http://www.w3.org/2001/XMLSchema#float','')}
    if(finalStr.includes('integer')){finalStr=finalStr.replace('^^http://www.w3.org/2001/XMLSchema#integer','')}
    if(finalStr.includes('string')){finalStr=finalStr.replace('^^http://www.w3.org/2001/XMLSchema#string','')}
    if(finalStr.includes('double')){finalStr=finalStr.replace('^^http://www.w3.org/2001/XMLSchema#double','')}
    return finalStr;
}

module.exports.groupsTCN =groupsTCN
