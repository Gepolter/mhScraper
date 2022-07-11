const PORT = 1337
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app = express()
var fs = require('fs')

var skillArr = []
var skillJson= {skillArr}

const url = 'https://monsterhunterrise.wiki.fextralife.com/Decorations'

axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        
        
        skillNames = []        
        has4Slot = []
        fourLvl = []
        skillSlots = []
        skillMaxLvls = []
        id = 0
        lvl4s = []
        lvl4sLvl = []
        dodged = 0
        $('#sub-main #wiki-content-block .table-responsive table tbody tr')
            .each(function(index, skillRow){
                //check if deco lvl 4
                if($(skillRow).find('> td:nth-child(2)').text().charAt(2) == "4"){
                    lvl4s.push($(skillRow).find('> td:nth-child(4) a').text().trim())
                    lvl4sLvl.push($(skillRow).find('> td:nth-child(4)').text().trim().split('').pop())
                    
                }else if($(skillRow).find('> td:nth-child(6)').text().trim().length > 3){
                    dodged++
                }else{
                    //names
                    $(skillRow).find('> td:nth-child(4) a').each(function(index, skillA){
                        
                        skillNames.push($(skillA).text().trim())
                        has4Slot.push(false)
                        fourLvl.push($(skillA).parent().text().trim().split("").pop())
                        
                    })
                    //slotlvl
                    $(skillRow).find('> td:nth-child(2)').each(function(index, slotChild){
                        skillSlots.push($(slotChild).text().charAt(2))
                    })
                    //maxLvl
                    $(skillRow).find('> td:nth-child(6)').each(function(index, maxLvlChild){
                        skillMaxLvls.push($(maxLvlChild).text().trim())
                    })
                    
                }


            })
            console.log(lvl4sLvl)
            //get Index of first occurence
            for(let i = 0; i < skillNames.length; i++){
                //console.log(skillNames[i])
                //console.log($(skillRow).find('> td:nth-child(4) a').text().trim())
                for(let j = 0; j < lvl4s.length; j++){
                    if(skillNames[i] == lvl4s[j]){
                        has4Slot[i] = true
                        fourLvl[i] = lvl4sLvl[j]
                    }
                }
            }

            for(let i = 0; i < skillNames.length; i++){
                const skill = {
                    _id: id,
                    _name: skillNames[id],
                    _slot_id: skillSlots[id],
                    _maxLvl: skillMaxLvls[id],
                    _deco_array:{
                        _slot1lvls: 0,
                        _slot2lvls: 0,
                        _slot3lvls: 0,
                        _slot4lvls: 0
                    }
    
                }
                skillArr.push(skill)
                id++
            }
        /*
        $('#sub-main #wiki-content-block .table-responsive table tbody tr > td:nth-child(4)')
        .each(function(index, nameChild){
            
            $(nameChild).find('a').each(function(index, skillA){
                
                skillNames.push($(skillA).text().trim())
                has4Slot.push(false)
                fourLvl.push($(skillA).parent().text().split("").pop())
                
            })
        })
        //console.log(skillNames)
        

        
        skillSlots = []
        $('#sub-main #wiki-content-block .table-responsive table tbody tr > td:nth-child(2)')
            .each(function(index, slotChild){
                
                skillSlots.push($(slotChild).text().charAt(2))
                if($(slotChild).text().charAt(2) == "4"){
                    for(let i = 0; i < skillNames.length; i++){
                        if(skillNames[i] == skillNames[skillSlots.length]){
                            has4Slot[i] = true
                            fourLvl[i] = fourLvl[skillSlots.length]

                        }
                    }
                }

            })
        //console.log(skillSlots)
        //console.log(has4Slot)
        
        skillMaxLvls = []
        $('#sub-main #wiki-content-block .table-responsive table tbody tr > td:nth-child(6)')
            .each(function(index, maxLvlChild){
                skillMaxLvls.push($(maxLvlChild).text())
            })
        //console.log(skillMaxLvls)

        let id = 0
        for(let i = 0; i < skillNames.length; i++){
            if(skillSlots[i] != "4"){
                const skill = {
                    _id: id,
                    _name: skillNames[i],
                    _slot_id: skillSlots[i],
                    _maxLvl: skillMaxLvls[i],
                    _has_four: has4Slot[i],
                    _fourLvl: fourLvl[i]
    
                }
                skillArr.push(skill)
                id++
            }

        }
        */
        console.log(dodged)
        console.log(lvl4s)
    })
    .catch((err) =>{
        console.log(err)
    })
    .finally(() =>{
        var json = JSON.stringify(skillJson)
        fs.writeFile('C:/Users/Dominik/vs-workspace/db_json/skills_master_rank.json', json, function(err, result){
            if(err) console.log('error', err)
        })
        console.log("eyyyyyyyyy")
    })

app.listen(PORT, () => console.log('server running on ${PORT}'))