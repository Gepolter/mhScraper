const PORT = 1337
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app = express()
var fs = require('fs')

var armorArr = []
var masterRankJson = {armorArr}




const url = 'https://monsterhunterrise.wiki.fextralife.com/Master+Rank+Armor'
var armorSetList = [];

axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        //looking for classes in mh wiki html 
        var fullSetPath =""
        $('.col-sm-12 ', html).find('span > a').each(function(index, element){
            fullSetPath = 'https://monsterhunterrise.wiki.fextralife.com' + ($(element).attr('href'))
            armorSetList.push(fullSetPath);
        });
        //console.log(armorSetList)
        //get into armorsets -> find armor parts
        /*
        for(armorSet in armorSetList){
            cheerio.load(armorSetList.armorSet)
        
        }*/
        //setup for json entries
        let id = 0
        for(setPage in armorSetList) {
            
            axios(armorSetList[setPage])
                .then(response => {
                    const html = response.data
                    const $ = cheerio.load(html)

                    let armorNames = []
                    $('.col-sm-7 div table tbody tr td h4 a').each(function(index, name){
                        armorNames.push($(name).text())
                    })
                    //console.log(armorNames)
                    
                    let armorSlotArrays = []
                    
                    $('.col-sm-7 div table tbody tr td span').each(function (index, decoImgSpan){
                        armorSlots = ""
                        $(decoImgSpan).find('img').each(function(index, decoImg){
                            if($(decoImg).attr('title').charAt(10) != "_"){
                                armorSlots +=$(decoImg).attr('title').charAt(10)
                            }else{
                                armorSlots += "4"
                            }
                        })
                        armorSlotArrays.push(armorSlots)
                    })
                    
                    armorSlotArrays = armorSlotArrays.filter(e => {
                        return e !== ''
                    })
                    //console.log(armorSlotArrays)
                    
                    let skillArrays = []
                    $('.infobox .table-responsive .wiki_table tbody tr td span').each(function (index, skillASpan){
                        skillArray = []
                        
                        $(skillASpan).find('a').each(function(index, skillA){
                            skillName = $(skillA).text()
                            indexOfLvl = $(skillA).parent().text().indexOf(skillName) + skillName.length + 2
                            skillLvl = $(skillA).parent().text().substring(indexOfLvl, indexOfLvl+1)
                            for(let i = 0; i < skillLvl; i++){
                                skillArray.push({_skill_name: skillName, _is_deco: false})
                            }
                        })
                        skillArrays.push(skillArray)
                    })
                    skillArrays = skillArrays.filter(e =>{
                        return e.length !== 0
                    })
                    //console.log(skillArrays)
                    //console.log($('.infobox .table-responsive .wiki_table tbody tr td span a'))
                    
                    
                    //set up a loop running 5 times to make one armorpiece and push to json 
                    for(let i = 0; i < armorNames.length; i++){
                        let typeStr = i.toString()

                        const armorPiece = {
                            _id: id,
                            _name: armorNames[i],
                            _type_id: typeStr,
                            _skill_array: skillArrays[i],
                            _slot_array_name: armorSlotArrays[i]
                        }
                        armorArr.push(armorPiece)
                        console.log(armorPiece)
                        id++
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() =>{
                    console.log("before json")
                    console.log("then finished")
                            
                    var json = JSON.stringify(masterRankJson)
            
                    fs.writeFile('C:/Users/Dominik/vs-workspace/db_json/armor_master_rank.json', json, function(err,result){
                        if(err) console.log('error', err)
                    })
                    console.log("eyyyyyyyyyyyyy")
                })

        
           
        }
        
    })
    

app.listen(PORT, () => console.log('server running on ${PORT}'))