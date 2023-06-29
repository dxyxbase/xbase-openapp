/* eslint-disable */

import { getModelPositionPlugin } from '@/components/ModelView/plugins/modelPosition/ModelPositionPlugin'

const bimPlugins = []

const createCIMPlugins = dx => {
  return [getModelPositionPlugin(dx)]
}

export const getExtraPlugins = app => {
  switch (app.options.engine) {
    case DX.mode.CIMSTREAMING:
    case DX.mode.CIM:
    case DX.mode.CESIUM:
      return createCIMPlugins(DX)
    case DX.mode.WEBGL:
    case DX.mode.SME:
      return bimPlugins
    case DX.mode.TWOD:
      break
  }
}
