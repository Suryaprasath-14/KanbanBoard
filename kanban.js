let addBtn = document.querySelector('.add-btn')
let modalCont = document.querySelector('.modal-cont')
let allPriortyCol =  document.querySelectorAll('.priority-col')
let textAreaCont = document.querySelector('.textArea-cont')
let mainCont = document.querySelector('.main-cont')
let removeBtn = document.querySelector('.remove-btn')
let toolboxColors = document.querySelectorAll('.color')

let modalPriorityCol ='lightpink'
let addTaskFlag = false
let removeTaskFlag = false
let lockIconClass = 'fa-lock'
let unlockIconClass = 'fa-lock-open'
let colors = ['lightpink', 'lightgreen', 'lightblue', 'black']
let ticketArray = []


addBtn.addEventListener('click', event =>{
    addTaskFlag=!addTaskFlag
    if(addTaskFlag==true)
    {
        modalCont.style.display='flex'
    }

    else{
        modalCont.style.display='none'
    }
 
})

//selecting ticket color
allPriortyCol.forEach(colElement =>{
    colElement.addEventListener('click',event =>{
        //remove active class from all
        allPriortyCol.forEach(priCol =>{
            priCol.classList.remove('active')
        })

        //add active class to particular clicked div
        colElement.classList.add('active')

        modalPriorityCol = colElement.classList[0]
        // console.log(modalPriorityCol)

    })
})

//Ticket creation

modalCont.addEventListener('keydown',event =>{
    let keypressed = event.key
    //console.log(keypressed)
    if(keypressed === 'Shift')
    {
        //ticketCreate
        let ticketDesc = textAreaCont.value
        let tcktId = shortid()
        createTicket(modalPriorityCol, tcktId, ticketDesc  )
        //close modal
        modalCont.style.display='none'
        addTaskFlag=!addTaskFlag
        //clear textarea
        textAreaCont.value=''
    }

})

function createTicket(ticketCol, ticketId, ticketDescription)
{
    let ticketCont = document.createElement('div')

    ticketCont.classList.add('ticket-cont');

    ticketCont.innerHTML = `<div class="ticket-col ${ticketCol}"></div><div class="ticket-id">${ticketId}</div><div class="task-area">${ticketDescription}</div><div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`

    mainCont.appendChild(ticketCont)

    let ticketMetaData = {
        ticketCol,
        ticketId,
        ticketDescription
    }
    //both are same way of object creation
    // let ticketMetaData = {
    //        "ticketCol": ticketCol,
    //        "ticketId": ticketId,
    //        "ticketDescription": ticketDescription
    // }

    ticketArray.push(ticketMetaData)
    // console.log(ticketArray)

    handleRemove(ticketCont)

    handleLock(ticketCont)

    handleColor(ticketCont)

}

//selecting remove button
removeBtn.addEventListener('click',event =>{
    removeTaskFlag = !removeTaskFlag

    if(removeTaskFlag === true)
    {
        //show alert and change icon to red color
        alert("Delete mode is activated")
        removeBtn.style.color= 'red'
    }
    else{ 
        //change icon color back
        removeBtn.style.color = 'white'
    }

})

function handleRemove(ticket){
    ticket.addEventListener('click',event =>{
        if(removeTaskFlag==true)
        {
            //removeTicket
            ticket.remove()
        }
    })
}

function handleLock(ticket){
    let ticketLockElement = ticket.querySelector('.ticket-lock')
 
    let ticketLockIcon=ticketLockElement.children[0]

    let taskArea = ticket.querySelector('.task-area')

    ticketLockIcon.addEventListener('click',() =>{
         
        if(ticketLockIcon.classList.contains(lockIconClass))
        {
            //remove locked class
            ticketLockIcon.classList.remove(lockIconClass)
            //add unlocked class
            ticketLockIcon.classList.add(unlockIconClass)
            //make the ticket editable
            taskArea.setAttribute('contenteditable', 'true')

        }
        else{
            //remove unlocked class
            ticketLockIcon.classList.remove(unlockIconClass)
            //add locked class
            ticketLockIcon.classList.add(lockIconClass)
            //make the ticket uneditable
            taskArea.setAttribute('contenteditable', 'false')

            //updating ticketarray state with new description
            let ticketID = ticket.children[1].innerText
        ticketArray.forEach(tckt =>{
           if(tckt.ticketId==ticketID)
           {
            tckt.ticketDescription = taskArea.innerText
           }
        })
        //console.log(ticketArray)
        }

        })
}

function handleColor(ticket)
{
    let ticketColorBand = ticket.querySelector('.ticket-col')

    ticketColorBand.addEventListener('click',() =>{
        let currentColor = ticketColorBand.classList[1]
        let currentColorIndex = colors.findIndex(color =>{
            return color== currentColor
        })
        currentColorIndex++

        let newColorIndex = currentColorIndex % colors.length
        let newColor = colors[newColorIndex]

        //remove current color
        ticketColorBand.classList.remove(currentColor)

        //add new color
        ticketColorBand.classList.add(newColor)


        //updating tticketarray state with new color
        let ticketID = ticket.children[1].innerText

        ticketArray.forEach(tckt =>{
            if(tckt.ticketId == ticketID)
            {
                tckt.ticketCol = newColor
            }
        })

        //console.log(ticketArray)

    })
}

//implementing filters

toolboxColors.forEach(toolboxColor =>{
    toolboxColor.addEventListener('click',()=>{
        let selectedToolBoxColor = toolboxColor.classList[0]
        
        let filteredTickets = ticketArray.filter(ticket =>{
            return selectedToolBoxColor == ticket.ticketCol

        })

        // console.log(filteredTickets)
        
        let allTickets = document.querySelectorAll('.ticket-cont')
        
        //remove all tickets
        allTickets.forEach(ticket =>{
            ticket.remove()
        })

        //recreate tickets within filtered array
        filteredTickets.forEach(filteredTicket => {
            createTicket(filteredTicket.ticketCol, filteredTicket.ticketId, filteredTicket.ticketDescription)

        })

    })

    toolboxColor.addEventListener('dblclick', () => {
        console.log('Double click')
        // remove all the tickets from the DOM
        let allTickets = document.querySelectorAll('.ticket-cont')

        allTickets.forEach(ticket => {
            ticket.remove()
        })

        // create all tickets from ticket array
        ticketArray.forEach(ticket => {
            createTicket(ticket.ticketCol, ticket.ticketId, ticket.ticketDescription)
        })
    })
})

