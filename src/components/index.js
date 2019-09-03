import Keyboard from './keyboard/index'
import DInPark from './inPark/index'
import DOutPark from './outPark/index'
import SmDialog from './dialog/index'
import BigImg from './bigImg/index'
import Player from './player/index'
import Shade from './shade/index'


import NavBar from './layout/Navbar'
import BeadCrumb from './layout/BeadCrumb'

const components = [
  Keyboard,
  DInPark,
  DOutPark,
  SmDialog,
  BigImg,
  NavBar,
  BeadCrumb,
  Player,
  Shade,
]


const install = function(Vue) {
  if(install.installed) return
  components.map(component => Vue.component(component.name, component))
}


export default {
  install,
  Keyboard,
  DInPark,
  DOutPark,
  SmDialog,
  BigImg,
  NavBar,
  BeadCrumb,
  Player,
  Shade,
}