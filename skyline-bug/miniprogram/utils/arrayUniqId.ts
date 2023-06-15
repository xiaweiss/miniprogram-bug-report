/**
 * 简单数组去重
 * @param array 数组（数组项是对象）
 * @param idName 数组元素的唯一标识名称
 */
export const arrayUniqId = (array: any[] = [], idName = 'id') => {
  const result = []
  const temp : Record<string | number, boolean> = {}

  for (const item of array) {
    const id = item && item[idName]

    if (
      (typeof id === 'string' || typeof id === 'number') &&
      !temp[id]
    ) {
      temp[id] = true
      result.push(item)
    }
  }

  return result
}

// interface NoteTag {
//   id: string
//   name: string
// }
// const arr: NoteTag[] = [{id: '1', name: 'a'}, {id: '2', name: 'b'}, {id: '1', name: 'c'}]
// console.log(arrayUniqId(arr))

