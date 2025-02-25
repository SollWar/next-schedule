// import { getContrastTextColor } from "@/utils/colorsUtils"
// import DropDown from "../DropDown/DropDown"

// const ScheduleTable = (schedule: string[]) => {
//   return(

//     <>
//     {schedule.map((day, index) => (
//           <DropDown
//             onSelected={onSelectedDwropDown}
//             className={styles.grid_item}
//             options={entityNames}
//             index={index}
//             key={`day-${index}`}
//             style={{
//               cursor: 'pointer',
//               color:
//                 day == '0'
//                   ? 'black'
//                   : getContrastTextColor(
//                       entityColors[entityIds.indexOf(day) + 1]
//                     ),
//               backgroundColor: entityColors[entityIds.indexOf(day) + 1],
//             }}
//           >
//             {index + 1}
//           </DropDown>
//         ))}</>

//   )
// }

// export default ScheduleTable
