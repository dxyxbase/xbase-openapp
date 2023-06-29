export function getCurrentRenderer (viewer) {
    const BimEngine = {
        webgl: 'BME',
        sme: 'SME',
        hybrid: 'FME'
    }

    const CimEngine = {
        cesium: 'CME',
        cimStreaming: 'RME',
    }
    let renderTypeTxt = ''
    const engineType = viewer.engineType
    if (BimEngine.hasOwnProperty(engineType)) {
        if (engineType === 'hybrid') {
            const currentEngine = viewer.engine.currentEngine
            renderTypeTxt = BimEngine[currentEngine]
        } else {
            renderTypeTxt = BimEngine[engineType]
        }
    }

    if (CimEngine.hasOwnProperty(engineType)) {
        renderTypeTxt = CimEngine[engineType]
    }
    return renderTypeTxt
}

export const BimRnderMode = ['BME', 'SME', 'FME']
export const CimRenderMode = ['CME', 'RME']

export const getRenderMode = (services, type) => {
    let renderMode = ''
    const renderService = services.find(item => {
        if (type === 'bim' && item.alias) {
            return BimRnderMode.includes(item.alias)
        }
        if (type === 'cim' && item.alias) {
            return CimRenderMode.includes(item.alias)
        }
    })
    if (renderService && renderService.alias) renderMode = renderService.alias
    return renderMode
}
