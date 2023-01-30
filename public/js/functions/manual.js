$(document).ready(function(){
    $("#manual-btn").click(function(){
      $("#manualModal").modal('show');
      //console.log('open')
      document.querySelector("#manualBody").innerHTML=""
      $( function() {
        $( "#m1" ).accordion({
            collapsible: true,
            active: false,
            heightStyle: "content"
        });
      });
      document.querySelector("#manualBody").insertAdjacentHTML("beforeend",`
            <div id="m1" class="check-col-1">
            <span class="badge badge-secondary" style="font-size:0.9rem; width:100%; grid-column-start: 1; grid-column-end: 4;">Create a chart</span>
                <div>
                    <p>1. In the Section 'Welcome Charts' a click on the Creation of Charts button will open the modal with the functionalities to create a chart</p>
                    <img src="img/im1.png">
                    <p class="pt-3">2. In the modal first we select the type of the chart (bar, pie, line, etc)</p>
                    <p class="pt-3">3. We are able to select via the checkboxes the attributes to be included in the chart. We can select up to three attributes </p>
                    <img src="img/im2.png">
                    <p>4. We have two categories of attributes categorical and numerical </p>
                    <p>5. For the categorical attributes, we select only the values that we want to include in a chart</p>
                    <img src="img/im3.png">
                    <p class="pt-3">6. When the attribute is numerical, we select the range and the bins</p>
                    <img src="img/im4.png">
                    <p class="pt-3">7. Finally, we click on save in the modal and then in the section 'Custom Charts' we click on the Created button and the chart is positioned in the temporary graphs column</p>
                </div>
                <span class="badge badge-secondary" style="font-size:0.9rem; width:100%; grid-column-start: 1; grid-column-end: 4;">MAX MIN and Average caclulations</span>
                <div>
                    <p>1. When we have a numerical type attribute, we can calculate correlations concerning MAX/MIN or Average numbers</p>
                    <p>2. For example, if we want to see the MAX/MIN of the scores for Minigames based on Gender. First, we select the attributes and then after clicking save, we can see the options for the calculations</p>
                    <img src="img/im5.png">
                    <p class="pt-3">3. We select MAX/MIN, we click the button Finish  and Create</p>
                    <img src="img/im6.png">
                </div>
                <span class="badge badge-secondary" style="font-size:0.9rem; width:100%; grid-column-start: 1; grid-column-end: 4;">Drag and Drop</span>
                <div>
                    <p>1. After the creation of a chart, we can click on it and drag and drop</p>
                    <p>2. Drag</p>
                    <img src="img/im7.png">
                    <p class="pt-3">3. Drop</p>
                    <img src="img/im8.png">
                </div>
                <span class="badge badge-secondary" style="font-size:0.9rem; width:100%; grid-column-start: 1; grid-column-end: 4;">Delete a chart</span>
                <div>
                    <p>1. To delete a chart, we double clicking on it</p> 
                </div>
                <span class="badge badge-secondary" style="font-size:0.9rem; width:100%; grid-column-start: 1; grid-column-end: 4;">Create a Dashboard</span>
                <div>
                    <p>1. After we have created charts and drag drop it in the ui, we are able to store them as dashboard. In the section dashboards, we can click the button save and store the dashboard</p>
                    <img src="img/im9.png">
                    <p class="pt-3">2. Then a modal is appearing on the screen where you put the name of the dash and store it</p>
                    <img src="img/im10.png">
                    <p class="pt-3">3. Finally, in the selection, we can see the newly created dashboard</p>
                    <img src="img/im11.png">
                </div>
                <span class="badge badge-secondary" style="font-size:0.9rem; width:100%; grid-column-start: 1; grid-column-end: 4;">Edit a Dashboard</span>
                <div>
                    <p>1. To edit a dahboard, first you select it and then add, remove and change position of the charts</p> 
                </div>
                <span class="badge badge-secondary" style="font-size:0.9rem; width:100%; grid-column-start: 1; grid-column-end: 4;">Delete a Dashboard</span>
                <div>
                    <p>1. To delete a dahboard, you select it from the selection and press the button delete</p> 
                </div>
                <span class="badge badge-secondary" style="font-size:0.9rem; width:100%; grid-column-start: 1; grid-column-end: 4;">Select a TCN based on the classroom</span>
                <div>
                    <p>1. The user initially chooses the Class category, and then the specific TCN from that class whose data he/she wants to display/correlate</p>
                    <img src="img/im12.png"> 
                </div>
                <span class="badge badge-secondary" style="font-size:0.9rem; width:100%; grid-column-start: 1; grid-column-end: 4;">TCN personal information</span>
                <div>
                    <p>1. The results are illustrated in the following modal. In this panel, general information concerning the TCN is provided, along with the basic statistics in terms of his/her performance achieved in the course’s activities</p>
                    <img src="img/im13.png">
                    <p class="pt-3">2. In the new version of the Visual Analytics Component, we have included a new sub component, which works as recommendation system. This system provides a recommendation about the future performance of a TCN in the different learning activities. The Recommendation System is based on specific attributes such as Age, Gender, Education Level and Language.  </p> 
                </div>
                <span class="badge badge-secondary" style="font-size:0.9rem; width:100%; grid-column-start: 1; grid-column-end: 4;">Create a chart for the specific classroom</span>
                <div>
                    <p>1. We click on the button 'Create Chart' in the modal for the specific TCN </p>
                    <p>2. Then we select the attributes and the type of the chart and we click save</p>
                    <img src="img/im14.png">
                    <p class="pt-3">3. The chart is created</p>
                    <img src="img/im15.png">
                </div>
                <span class="badge badge-secondary" style="font-size:0.9rem; width:100%; grid-column-start: 1; grid-column-end: 4;">Excel functionality</span>
                <div>
                    <p>1. To open the modal for Excel functionality, we go in the section 'Excel Charts' and we click on the Creation of Charts button to reveal the modal</p>
                    <img src="img/im16.png">
                    <p>2. In the modal, we can choose an excel file and upload it in the system</p>
                    <p>3. We can select which excel, we want to use the data to produce charts</p>
                    <img src="img/im17.png">
                    <p>4. We give the utility to remove an excel file, by pressing the button delete for the selected excel file</p>
                    <img src="img/im18.png">
                    <p>5. The process to create charts is the same with the previous instructions. Select type of chart, decide which attributes to be included in the chart and press the button Create to produce the desired chart</p>
                    <img src="img/im19.png">
                </div>
                <span class="badge badge-secondary" style="font-size:0.9rem; width:100%; grid-column-start: 1; grid-column-end: 4;">Analytical report</span>
                <div>
                    <p>1. In the section Analytical report in the UI, we press the button Export charts and we produce one image per chart to use it in reports</p> 
                    <img src="img/im20.png">
                </div>       
            </div>`)
    });
  });