const generateWhere = filter => {
  let whereSql = Object.entries(filter).reduce((acc, [key, value]) => {
    if (!value) return acc
    if (acc) return acc.concat(` AND ${key} LIKE '%${value}%'`)
    return acc.concat(`${key} LIKE '%${value}%'`)
  }, '')

  if (whereSql) whereSql = ` WHERE ${whereSql}`
  return whereSql
}

const generateUpdate = ({ table, fields, changes, where, isUpdatedAt }) => {
  // console.log({table, fields, changes, where, isUpdatedAt})
  const fieldsUpdate = { updatedUser: 'number', updatedAt: 'string' }
  fields = { ...fields, ...fieldsUpdate }

  let updateSql = Object.entries(fields).reduce((acc, [key, type]) => {
    const value = changes[key]
    if (type.toLowerCase() === 'number') {
      if (typeof value !== 'number') return acc
    } else {
      if (!value) return acc
    }

    let comma = acc ? ',' : ''

    if (type.toLowerCase() === 'string') return acc.concat(`${comma} ${key} = '${value}'`)
    return acc.concat(`${comma} ${key} = ${value}`)
  }, '')

  const updatedAt = (isUpdatedAt) ? ', updatedAt = SYSDATETIME()' : ''
  where = ` WHERE ${where} `
  if (updateSql) updateSql = `UPDATE ${table} SET ${updateSql} ${updatedAt} ${where}`
  // console.log({updateSql})
  return updateSql
}

const control = {
  fileds: `uc.nombre [createdUserNombre], 
      uc.usuario [createdUserUsername],
      uu.nombre [updatedUserNombre], 
      uu.usuario [updatedUserUsername]`,
  join: alias => `LEFT JOIN BIGIVCA.dbo.usuarios AS uc
      ON ${alias}.createdUser = uc.id
  LEFT JOIN BIGIVCA.dbo.usuarios AS uu
      ON ${alias}.updatedUser = uu.id`
}

module.exports = {
  generateWhere,
  generateUpdate,
  control
}
