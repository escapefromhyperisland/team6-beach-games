/* import 'aframe'
import 'aframe-extras' */

let state = {}
const stateCreator = () => {
	state = {
		comp1: false,
		comp2: false,
		end: false,
	}
	sessionStorage.setItem('state', JSON.stringify(state))
}
stateCreator()

state = JSON.parse(sessionStorage.getItem('state'))
if (state) {
	console.log(state)
}
const endState = () => {
	if (state.comp1 == true || state.comp2 == true) {
		console.log('comp +')
	}
	if (state.comp1 == true && state.comp2 == true) {
		console.log('comp &&')
		state.end = true
		sessionStorage.setItem('state', JSON.stringify(state))
		alert('The end')
		window.parent.postMessage('nextLevel')
	}
}

const stateUpdater1 = () => {
	console.log('comp1')
	state = JSON.parse(sessionStorage.getItem('state'))
	if (state.comp1 == false) {
		answer = prompt("What's the correct animal?")
		if (answer == 'bumblebee') {
			state.comp1 = true
			sessionStorage.setItem('state', JSON.stringify(state))
			endState()
		} else {
			alert('Wrong answer!')
		}
	} else {
		alert('Challenge already done')
	}
}
const stateUpdater2 = () => {
	console.log('comp2')
	state = JSON.parse(sessionStorage.getItem('state'))
	if (state.comp2 == false) {
		answer = prompt('What does the morse say?')
		if (answer == 'help') {
			state.comp2 = true
			sessionStorage.setItem('state', JSON.stringify(state))
			endState()
		} else {
			alert('Wrong answer!')
		}
	} else {
		alert('Challenge already done')
	}
}
