import _ from 'lodash'
const filterProperties = ['族名称', '族与类型']
const modelAllMapping = {
  rvt: {
    memberName: '族',
    memberId: '类型 ID',
    memberCategory: '类别',
    memberType: '类型'
  }
}
let modelMapping = {}
const basicInfoObj = {
  memberName: '构件名称',
  memberId: '构件ID',
  memberCategory: '构件类别',
  memberType: '构件类型'
}
const basicInfoSortBy = ['Name', 'Id', 'GUID', 'UniqueID', 'bbox']
const getNewCategories = categories => {
  let basicInfoProperties = []
  categories.forEach((item, index) => {
    const { category, properties = [], type } = item
    for (let index = 0; index < properties.length; index++) {
      const property = properties[index]
      if (filterProperties.includes(property.name)) {
        properties.splice(index, 1)
        index--
      }
      if (Object.values(modelMapping).includes(property.name)) {
        // 获取property.name与modelMapping值相同的key值
        const key = Object.keys(modelMapping).find(key => modelMapping[key] === property.name)
        property.name = basicInfoObj[key]
        basicInfoProperties.push(property)
        // 删除该项
        properties.splice(index, 1)
        index--
      }
    }
  })
  // basicInfo去重
  basicInfoProperties.forEach((item, index) => {
    if (basicInfoProperties.findIndex(item1 => item1.name === item.name) !== index) {
      basicInfoProperties.splice(index, 1)
    }
  })
  // basicInfo内按照basicInfoObj的顺序排序
  basicInfoProperties.sort((a, b) => {
    const values = Object.values(basicInfoObj)
    return values.indexOf(a.name) - values.indexOf(b.name)
  })
  const basicInfo = _.cloneDeep(categories).filter(item => item.category === '基本信息')
  sortAndFilterEmpty(categories)
  // 将基本信息的属性放到其他中
  if (basicInfo.length) {
    const { properties = [] } = basicInfo[0]
    properties.sort((a, b) => {
      return basicInfoSortBy.indexOf(a.name) - basicInfoSortBy.indexOf(b.name)
    })
    const other = {
      category: '其他',
      properties: properties,
      type: 'Type'
    }
    categories.push(other)
  }
  // 将基本信息放到第一项
  categories.forEach((item, index) => {
    if (item.category === '基本信息') {
      // 如果为空则删除该项
      if (!basicInfoProperties.length) {
        categories.splice(index, 1)
        return
      }
      item.properties = basicInfoProperties
      categories.splice(index, 1)
      categories.unshift(item)
    }
  })
  return categories
}
const sortAndFilterEmpty = categories => {
  categories.sort((a, b) => {
    return a.category.localeCompare(b.category)
  })
  function mixSort(_a, _b) {
    const reg = /[a-zA-Z0-9]/
    // 比对仅针对字符串，数字参与对比会导致对比的字符串转为number类型，变成NaN
    const a = _a.toString()
    const b = _b.toString()
    // 比对0号位的原因是字符串中有可能出现中英文混合的情况，这种仅按首位排序即可
    if (reg.test(a[0]) || reg.test(b[0])) {
      if (a > b) {
        return 1
      } else if (a < b) {
        return -1
      } else {
        return 0
      }
    } else {
      return a.localeCompare(b)
    }
  }
  categories.sort((a, b) => mixSort(a.category, b.category))
  for (let i = 0; i < categories.length; i++) {
    const { properties = [] } = categories[i]
    // name按照0~9 a~z排序
    properties.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
    if (!properties.length) {
      categories.splice(i, 1)
      i--
    }
  }
}
// 多个属性：只展示相同的key，key值一致的展示原有值，不一致展示“多种”
const dealMultipleProperty = data => {
  let result = _.cloneDeep(data[0].categories)
  console.log('data-----', data)
  data.forEach(obj => {
    const { categories } = obj
    // 找出与result有相同category的项
    const intersection = categories.filter(obj1 => result.some(obj2 => obj1.category === obj2.category))
    // 保留result中与intersection相同category的项
    result = _.cloneDeep(result.filter(obj1 => intersection.some(obj2 => obj1.category === obj2.category)))
    // 与result对比值，一致的展示原有值，不一致展示“多种”
    intersection.forEach((item, index) => {
      result.forEach((item1, index1) => {
        if (item1.category === item.category) {
          const { properties: properties1 } = item
          const { properties: properties2 } = item1
          // 去除properties中没有交集的项
          // 因其他字段会出现多个，最后一个其他字段进行处理
          if (item1.category === '其他' || item.category === '其他') {
            // 当两个其他字段都不是最后一个时
            const neitherLast = index !== intersection.length - 1 && index1 !== result.length - 1
            // 当其中一个其他字段是最后一个时
            const oneLast = index === intersection.length - 1 || index1 === result.length - 1
            // 当两个其他字段都是最后一个时，进行处理
            // if (index === intersection.length - 1 && index1 === result.length - 1) {
            //   item1.properties = properties2.filter(obj1 => properties1.some(obj2 => obj1.name === obj2.name));
            // }
            if ((oneLast && index1 !== result.length - 1) || neitherLast) {
              item1.properties = properties2.filter(obj1 => properties1.some(obj2 => obj1.name === obj2.name))
            }
          } else {
            item1.properties = properties2.filter(obj1 => properties1.some(obj2 => obj1.name === obj2.name))
          }
          item.properties.forEach((item2, index2) => {
            item1.properties.forEach((item3, index3) => {
              if (item2.name === item3.name) {
                if (item2.value !== item3.value) {
                  item3.value = '多种'
                }
              }
            })
          })
        }
      })
    })
  })
  // 过滤result中没有properties的项
  result = result.filter(item => item.properties.length)
  I18(result || [])
  return {
    categories: result,
    name: data[0].name,
    path: data[0].path,
    tag: data[0].tag,
    uid: data[0].uid
  }
}
const I18 = categories => {
  if (!categories.length) return
  // 判断第一项是否为基本信息
  if (categories[0].category === '基本信息') {
    categories[0].category = '基本信息'
  }
  // 判断最后一项是否为其他
  if (categories[categories.length - 1].category === '其他') {
    categories[categories.length - 1].category = '其他'
  }
  return categories
}
const dealProperties = (propertyData = [], modelType) => {
  const clonePropertyData = _.cloneDeep(propertyData)
  modelMapping = modelAllMapping[modelType] || modelAllMapping.rvt
  clonePropertyData.forEach(item => {
    const { categories = [] } = item
    getNewCategories(categories)
  })
  const arrLength = clonePropertyData.length
  if (arrLength <= 1) {
    // 判断第一项是否为基本信息
    I18(clonePropertyData[0].categories || [])
    return clonePropertyData[0] || {}
  } else {
    // 处理多组构件属性
    return dealMultipleProperty(clonePropertyData)
  }
}
export default dealProperties
