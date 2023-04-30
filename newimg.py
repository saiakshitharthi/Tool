from PIL import Image
import os
import exifread
import math
# Specify the folder path containing the images
folder_path = "."

def get_exif_data(image_file):
    with open(image_file, 'rb') as f:
        exif_tags = exifread.process_file(f)
    return exif_tags

R = 10000000
is_first =1
off_set_lat = 0
off_set_long = 0
lat_and_long = []

def get_exif_location(exif_data, image_file):
    gps_latitude = exif_data.get('GPS GPSLatitude')
    gps_longitude = exif_data.get('GPS GPSLongitude')
    pose_heading_degree = exif_data.get('GPS GPSImgDirection')

    # only works for eastern and northern hemisphere
    if gps_latitude and gps_longitude:
        lat = convert_to_degress(gps_latitude)
        long = convert_to_degress(gps_longitude)
        pos = pose_heading_degree
        global is_first
        global off_set_lat
        global off_set_long
        if is_first == 1:
            is_first = 0
            off_set_lat = lat
            off_set_long = long
            lat_and_long.append([0,0,pose_heading_degree])
        else :
            lat_and_long.append([lat-off_set_lat,long-off_set_long,pos])
        lat = lat-off_set_lat
        long = long - off_set_long
        first = R*math.cos(lat*math.pi/180)*math.sin(long*math.pi/180)
        second = R*math.sin(lat*math.pi/180)
        file1 = open("myfile.txt", "a")
        L = [image_file, " ", str(float(first)), " ", str(
            float(second)), " ", str(float(pos.values[0])), "\n"]
        file1.writelines(L)
        file1.close()


def convert_to_degress(value):
    value = value.values
    d0 = value[0]
    d1 = value[1]/60
    d2 = value[2]/3600
    d = d0 + d1 + d2
    return d0 + d1 + d2


# Open the output text file in write mode
with open("myfile.txt", "w") as f:

    # Loop through all files in the folder
    for filename in os.listdir(folder_path):

        # Check if the file is an image
        if filename.endswith((".JPG")):
            # Open the image file and extract the metadata
            image_path = os.path.join(folder_path, filename)
            tags = get_exif_data(image_path)
            get_exif_location(tags, image_path)