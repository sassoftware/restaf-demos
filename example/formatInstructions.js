/*
 * Copyright © 2021, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

function formatInstructions(instructions) {
  let inst = `
  Process the output from tools using the following guidelines:

  - In the response include all the information from the tool output including nested objects. Allow items like scores, probabilities, and other metrics to be included in the response.q

  - Always include annotation when information is found in a file.

  - Always report always include annotation when information is found in a file.

  - format result as html. Below are some examples of how to format the response from the tools.

  - format results like this {a1:10, bx:20, c: {cx:3, az: 4},...} as a table with two columns, key and value. format nested objects the same way

  - if the schema is this schema [object, object, ...] where an object is defined above, make each object a row in the table and follow the
  recommendations above for each object.

  - if the string is a comma-delimited format then format it as an html table using the first row as the column headers.
  
  The preferred styling for the html table is as follows:
  The html table should have a light blue background for the column headers.
  Use a border width of 1px and solid line for all cells in the table.
  if the cell value is a number, right-align the text in the cell.

  Below is an example of a  html table format with nested table

      '<table>     
         <tr>     
           <th>Name</th>     
           <th>Value</th>     
         </tr>     
         <tr>     
           <td>a</td>     
           <td>     
             <table>     
               <tr>     
                 <th>Name</th>     
                 <th>Value</th>     
               </tr>     
               <tr>     
                 <td>a1</td>     
                 <td>10</td>     
               </tr>     
               <tr>     
                 <td>bx</td>     
                 <td>20</td>     
               </tr>     
               <tr>     
                 <td>c</td>     
                 <td>     
                   <table>     
                     <tr>     
                       <th>Name</th>     
                       <th>Value</th>     
                     </tr>     
                     <tr>     
                       <td>cx</td>     
                       <td>3</td>     
                     </tr>     
                     <tr>     
                       <td>az</td>     
                       <td>4</td>     
                     </tr>     
                   </table>     
                 </td>     
               </tr>     
             </table>     
           </td>     
         </tr>     
         <tr>     
           <td>d</td>     
           <td>     
             <table>     
               <tr>     
                 <th>Name</th>     
                 <th>Value</th>     
               </tr>     
               <tr>     
                 <td>d1</td>     
                 <td>10</td>     
               </tr>     
               <tr>     
                 <td>d2</td>     
                 <td>20</td>     
               </tr>     
             </table>     
           </td>     
         </tr>     
       </table>     
     '

  if the response from a tool is of the form  like ['a','b','c', ...] or [1,11,8, ...] then format it as  html unordered list element
  Below is a sample html unordered list format.
  '<ul>
    <li>a</li>
    <li>b</li>
    <li>3</li>
  </ul>'

 if the response from a tool is of the form  like '- a\n - b\n - c\..' then format it as  html unordered list element like this:
  '<ul>
    <li>a</li>
    <li>b</li>
    <li>c</li>
  </ul>'
    The suggested styling for the html table is as follows:
    The html table should have a light blue background for the column headers.
    Use a border width of 1px and solid style for the table.
`
  return instructions + ' ' +  inst;
}
export default formatInstructions;