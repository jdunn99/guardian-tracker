# Since Lost Sectors aren't accessible from the API and are on a static rotation,
# I am just parsing a spreadsheet found here: https://docs.google.com/spreadsheets/d/1kd0juMU-YWtFVc9BLQEnD5r_WETVBDgmWDkAWuq3SxE/edit#gid=2094972221
# into JSON

import pandas
import json

# Read excel document
excel_data_df = pandas.read_excel('lost-sectors.xlsx')

# Convert excel to string 
# (define orientation of document in this case from up to down)
thisisjson = excel_data_df.to_json(orient='records')


# Make the string into a list to be able to input in to a JSON-file
thisisjson_dict = json.loads(thisisjson)

new_data = {}

for item in thisisjson_dict:
  new_data[item["Date"]] = item

print(new_data)

# Define file to write to and 'w' for write option -> json.dump() 
# defining the list to write from and file to write to
with open('data.json', 'w') as json_file:
    json.dump(new_data, json_file)