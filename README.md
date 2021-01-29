Dear senior developers,

I have prepared a trimmed down repository for you of both backend and frontend.

Your task is prepare a component displaying a shot chart heatmap with hexagon fields
The chart shows shots for a given match and team as a heatmap counting shots from each hexagon
Don't worry about the explaining arrows 

For frontend you will use Angular, d3
For backend flask and pandas (or ideally spark)

Steps:
1) Make both projects work bug free (Lot of files have been cut off)
   You are free to use your own boilerplate project template for Angular and flask
2) Remove eveything from the project structure you dont need for the final chart and data processing
3) Extract functions that might be useful for similar projects into the functions files in src/app/functions

Backend task:
1) Parse the event data (contains only shots) and distinguish different types of shots and results
2) Transform the data for to the final format sent over REST API (Calculate the hexagon fields before you send the data)
3) Create your own endpoint and call it from frontend

Frontend task:
1) Use the shot chart I sent you to understand the basics of d3
2) Extract special functions ín the visualization.functions.ts to display symbols and to break the field into hexagons
3) Combine the original shot chart and these new functions to produce the final result
4) Clean the code of the new chart component (many small functions, readable variable names, etc.)


