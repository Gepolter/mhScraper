const PORT = 1337
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app = express()
var fs = require('fs')

var skillArr = []
var skillJson = {skillArr}

const url = 'https://monsterhunterrise.wiki.fextralife.com/Decorations'

var skillPageList = []
let id = 0
axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        
        $('#embedded-a8a504b4-9ffe-440c-91c0-778217c5550f div.table-responsive table tbody tr')
            .each(function(index, skillRow){
                
                skillNames = []
                $(skillRow).find('td a').each(function(index, nameA){
                    skillNames.push($(nameA).text())    
                })
                console.log(nameA)
                this.breaksd()

                slotIds = []

                maxLvls = []

                const skill= {
                    _id: id,
                    _name: "",
                    _slot_id: "",
                    _maxLvl: 0,
                    _has_four: false,
                    _four_lvl: 0


                }
                skillArr.push(skill)
                console.log(skill)
                id++
            })
        
    })
