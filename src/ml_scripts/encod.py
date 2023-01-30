# Program for demonstration of one hot encoding

# import libraries
import numpy as np
import pandas as pd

def onehotencoder(data):
    
    #print(data['Gender'].unique())
    #print(data['EducationalLevel'].unique())
    #print(data['MotherTongue'].unique())

    #print(data['Gender'].value_counts())
    #print(data['EducationalLevel'].value_counts())
    #print(data['MotherTongue'].value_counts())

    one_hot_encoded_data = pd.get_dummies(data, columns = ['Gender','EducationalLevel','MotherTongue'])
    
    return one_hot_encoded_data



