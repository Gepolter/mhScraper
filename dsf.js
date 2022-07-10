$('.col-sm-7 div table tbody tr td span').each(function (index, decoImgSpan){
    $(decoImgSpan + ' img').each(function(index, decoImg){

        armorSlotArrays.push($(decoImg).attr('title').charAt(10))
    })
})