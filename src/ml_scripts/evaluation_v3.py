import numpy as np
import pandas as pd
import pickle, os

import sys
from sklearn import tree
from sklearn.tree import DecisionTreeClassifier

from encod import onehotencoder # for data encoding with the aid of OneHotEncoding
from sklearn import preprocessing
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder
#Testing function
# compare algorithms

from pandas import read_csv

def evaluation(X_validation,trainedmodel, features_enc):
    
    newpredict = pd.get_dummies(X_validation)
    eval_features_names = newpredict.columns.tolist()

    # missing_features = list(features_enc %in eval_features_names) -> features that are not belong in the eval_features_names list
    missing_features = [value for value in features_enc if value not in set(eval_features_names) ]
    zeros_df = pd.DataFrame(0, np.arange(len(newpredict)), columns=missing_features )

    newpredict = pd.concat( [newpredict, zeros_df], axis=1 )
    newpredict = pd.DataFrame(data=newpredict, columns = features_enc)

    predictions = trainedmodel.predict(newpredict)

    return predictions


#=============================================================================
#main_eval
#na diavasw to model k na to kanw deserialize
#mod = pickle.load(model, *, fix_imports=True, encoding='ASCII', errors='strict', buffers=None)

# Find directory with the stored trained models
current_dirs_parent = os.getcwd()
root_path_dir = sys.argv[5]
print(root_path_dir)
print(os.path.isdir(root_path_dir))

if  os.path.isdir(root_path_dir) == False:
    path_output_name = sys.argv[5]
    pickle_in = open(path_output_name,"rb")
    mod = pickle.load(pickle_in)

    trmod = mod['Model']
    features = mod['Encoding_Features']
    print(features)

    #----------Allages 30/3/22---------------------
    Age = sys.argv[1]
    Gender = sys.argv[2]
    EducationalLevel = sys.argv[3]
    MotherTongue = sys.argv[4]
    
    dat = np.array([[Age,Gender,EducationalLevel,MotherTongue]])
    col_names = ['Age','Gender','EducationalLevel','MotherTongue']
    new_input = pd.DataFrame(data=dat, columns=col_names)
    new_input['Age'] = float(new_input['Age'])
    print(new_input)
    
    new_output = evaluation(new_input, trmod, features)
    print(new_output[0])

    #sys.exit()
    #--------------Allages 30/3/22-----------------------------
    '''
    #----------allages 22/3/22------13:52-------VocabularyScoreΜodel---------------
    path_output_name = root_path_dir + "output_VocabTrainedModel"
    pickle_in = open(path_output_name,"rb")
    mod1 = pickle.load(pickle_in)

    trmod1 = mod1['Model']
    features1 = mod1['Encoding_Features']
    #print(features1)
    
    dat = np.array([[Age,Gender,EducationalLevel,MotherTongue]])
    col_names1 = ['Age','Gender','EducationalLevel','MotherTongue']
    new_input1 = pd.DataFrame(data=dat, columns=col_names1)
    new_input1['Age'] = float(new_input1['Age'])
    print(new_input1)
    
    new_output1 = evaluation(new_input1, trmod, features)
    print("Estimated VocabularyScore Class for the TCN: ", new_output1[0])
    
    #recom_Vocal = evaluation(dset_toclass, trmod1, features1)

    #-----------------22/3/22-----13:55-----WritingScoreModel------------------------------
    path_output_name = root_path_dir + "output_WriteTrainedModel"
    pickle_in = open(path_output_name,"rb")
    mod2 = pickle.load(pickle_in)

    trmod2 = mod2['Model']
    features2 = mod2['Encoding_Features']
    #print(features2)
    
    dat = np.array([[Age,Gender,EducationalLevel,MotherTongue]])
    col_names2 = ['Age','Gender','EducationalLevel','MotherTongue']
    new_input2 = pd.DataFrame(data=dat, columns=col_names2)
    new_input2['Age'] = float(new_input2['Age'])
    print(new_input2)
    
    new_output2 = evaluation(new_input2, trmod, features)
    print("Estimated WritingScore Class for the TCN: ", new_output2[0])
    '''
    #recom_Writing = evaluation(dset_toclass, trmod2, features2)

    # Concatenate the predictions
    #dset_toclass['Predicted_ScoreLevel_Class'] = recom
    #dset_toclass['Predicted_Vocabulary_ScoreLevel_Class'] = recom_Vocal
    #dset_toclass['Predicted_Writing_SoreLevel_Class'] = recom_Writing

    # Save to csv
    #output_file_name_eval = current_dirs_parent + "Predicted_Scores.csv"
    #dset_toclass.to_csv(output_file_name_eval, index=False, encoding='utf-8')

    print("\n Evaluation process is terminated!!! \n")

else:
    print("\n The evaluation process could not be executed!!! \n")