FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN apt-get update || : && apt-get install python -y
RUN apt-get install python3-pip -y

RUN pip3 install numpy==1.20.1
RUN pip3 install matplotlib==3.3.4
RUN pip3 install pandas==1.2.3
RUN pip3 install scikit-learn==0.23.0



COPY . .

EXPOSE 2000

CMD ["npm", "start"]
