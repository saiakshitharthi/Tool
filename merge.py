with open('orig_coordinates.txt', 'r') as f1,open('jengraimukh_coordinates.txt','w') as f3:
    # read lines from both files simultaneously
    for line1 in f1:
        with open('myfile.txt','r') as f2:
            for line2 in f2:
                # print(line1)
                first = line1.split(" ")
                second = line2.split(" ")
                # print(first,second[0])
                myname = second[0].split(".")[1].split("/")[1]
                if myname == first[0]:
                    f3.write(f'{second[0]} -{first[1]} {first[2][:-1]} {second[3]}')
