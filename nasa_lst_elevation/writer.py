# Reads files that were downloaded to nasa_lst_elevation/data
# and writes relevant data to a dictionary object
# which is serialized to disk

import json
import tables as tb
import os 

directory = "C:\\Users\\Danie\\Desktop\\Topics\\Bots\\nasa\\nasa_lst_elevation\\data"

files = os.listdir(directory)


def processFiles():
    totalFiles = len(files)
    fileNum = 0
    
    elevationData = []
    
    while(fileNum < totalFiles):
        try:
            hdf5 = openFile(fileNum)
            data = parseData(hdf5)
            hdf5.close()
        
            addDataToList(data, elevationData)
        except:
            print("ERROR in file ", fileNum)
            
        fileNum += 1
        
    # Done
    with open('C:\\Users\\Danie\\Desktop\\Topics\\Bots\\nasa\\nasa_lst_elevation\\elevation-data.json', 'w') as outfile:
        json.dump(elevationData, outfile)
        
    print("Done!")
    sys.stdout.flush()

def openFile(fileNum):
#     print(fileNum / len(files) * 100, "%")

    file = files[fileNum];
    return tb.open_file(directory + "\\" + file)
            
def parseData(fileData):
#     print("(Lat, Long)\n\n")

    swLong = fileData.root.Geolocation.Longitude[0][0]
    swLat = fileData.root.Geolocation.Latitude[0][0]
    swElevation_m = fileData.root["ASTER GDEM"].ASTGDEM[0][0]
    swElevation_ft = swElevation_m * 3.28084
#     print("(", swLat, ", ", swLong, "):\n", swElevation_ft, "ft, ", swElevation_m, "m\n\n")
            
    neLong = fileData.root.Geolocation.Longitude[99][99]
    neLat = fileData.root.Geolocation.Latitude[99][99]
    neElevation_m = fileData.root["ASTER GDEM"].ASTGDEM[99][99]
    neElevation_ft = neElevation_m * 3.28084
#     print("(", neLat, ", ", neLong, "):\n", neElevation_ft, "ft, ", neElevation_m, "m\n\n")
        
    return {
        'sw': {
            'lat': swLat,
            'long': swLong,
            'elevation': swElevation_m
        },
        'ne': {
            'lat': neLat,
            'long': neLong,
            'elevation': neElevation_m
        }
    }

def addDataToList(data, list):        
    list.append({
        'lat': str(data['sw']['lat']),
        'long': str(data['sw']['long']),
        'elevation': str(data['sw']['elevation'])
    })
    list.append({
        'lat': str(data['ne']['lat']),
        'long': str(data['ne']['long']),
        'elevation': str(data['ne']['elevation'])
    })
    
processFiles()