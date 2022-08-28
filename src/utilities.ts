export function max(arr: any[], func: Function = (entry: any) => entry): any {
    let maxValue = func(arr[0]);
    let maxIndex = 0;
    for (let i = 1; i < arr.length; i++) {
        let newValue = func(arr[i])
       if (newValue > maxValue) {
        maxValue = newValue
        maxIndex = i
       } 
    }
    return arr[maxIndex]
}