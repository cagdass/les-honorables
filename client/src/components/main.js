/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import { AppBar, MenuItem, IconMenu, IconButton, TextField, RaisedButton } from 'material-ui';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Dialog from 'material-ui/Dialog';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Slider from 'material-ui/Slider';

import baseAPI from "../../utility/base_api.js";

class Service {
  constructor() {
  }

  searchStudents(firstName, lastName) {
      return baseAPI.get("student?firstName=" + firstName  + "&lastName=" + lastName).catch(error => {
          console.error(error);
          return null;
      })
  }
}

var service = new Service();

const styles = {
  container: {
    textAlign: 'center',
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
  appBar: {
    height: 50,
    color: 'orange'
  }
});

const Settings = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  >
    <MenuItem onClick={props.handleClick} primaryText="About" />
  </IconMenu>
);

Settings.muiName = 'IconMenu';

class Main extends Component {
  constructor (props, context) {
    super(props, context);

    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    let params = this.props.location.query;

    let _firstName = params.firstName || '';
    let _lastName = params.lastName || '';

    this.state = {
      about: false,
      open: false,
      loading: false,
      dirty: false,
      firstName: _firstName,
      lastName: _lastName,
      students: [],
      processedStudents: []
    };
  }

  componentDidMount() {
    let { firstName, lastName } = this.state;

    if (firstName || lastName) {
      this.findStudents(firstName, lastName);
    }
  }

  findStudents (firstName, lastName) {
    return service.searchStudents(firstName, lastName)
        .then(students => {
            this.setState({"loading": false, "students": students});
            this.processStudents();
        })
        .catch(searchError => this.setState({searchError}));
  }

  processStudents () {
    let { students } = this.state;
    let processedStudents = [];
    let i = 0;
    for (; i < students.length; i += 1) {
      let current = students[i];
      let s = 0;
      let found = false;
      for (; s < processedStudents.length; s += 1) {
        // "Probably" the same student if the names and the departments match.
        // Though a possible bug may arise for students who changed departments.
        if (processedStudents[s].firstName === students[i].firstName
          && processedStudents[s].lastName === students[i].lastName) {
            // The student is found.
            found = true;

            // Add the found semester and the honor status to the student's record.
            processedStudents[s].semesters.push({
              'status': students[i].status,
              'semester': students[i].semester
            });
          }
      }

      if (!found) {
        processedStudents.push({
          'firstName': students[i].firstName,
          'lastName': students[i].lastName,
          'department': students[i].department,
          'semesters': []
        })

        processedStudents[processedStudents.length - 1].semesters.push({
          'status': students[i].status,
          'semester': students[i].semester
        });
      }
    }

    this.setState({'processedStudents': processedStudents});
  }

  handleRequestClose () {
    this.setState({
      open: false,
    });
  }

  handleTouchTap () {
    this.setState({
      open: true,
    });
  }

  handleMenuClick() {
    this.setState({about: true})
  }

  handleArrowClick() {
    this.setState({about: false})
  }

  handleFirstNameChange(e) {
    this.setState({firstName: e.target.value})
  }

  handleLastNameChange(e) {
    this.setState({lastName: e.target.value})
  }

  handleSubmit() {
    this.setState({
      dirty: true,
      loading: true,
      students: [],
      processedStudents: []
    });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      let { firstName, lastName } = this.state;
      this.handleSubmit();
      this.findStudents(firstName, lastName);
    }
  }

  handleHonorClick() {
    let { firstName, lastName } = this.state;
    this.handleSubmit();
    this.findStudents(firstName, lastName);
  }

  getSemester(semester) {
    var suffix = semester.substring(0,4);
    if(semester[4] === '1') {
      return suffix + " Fall";
    }
    else {
      return (Number(suffix) + 1) + " Spring";
    }
  }

  renderStudent (student) {
    let { semesters } = student;

    const styles = {
      titleStyle: {
        marginLeft: 20
      },
      containerStyle: {
        marginBottom: 30
      }
    }

    return (
      <div style={styles.containerStyle}>
        <h3 style={styles.titleStyle}>{student.firstName + " " + student.lastName + ", " + student.department}</h3>
        <Table
          selectable={false}
          multiSelectable={false}
          >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Status</TableHeaderColumn>
              <TableHeaderColumn>Semester</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            showRowHover deselectOnClickaway>
            {semesters.map(this.renderSemester.bind(this))}
          </TableBody>
        </Table>
      </div>
    )
  }

  renderSemester (item) {
    return (
      <TableRow>
        <TableRowColumn>{this.getSemester(item.semester)}</TableRowColumn>
        <TableRowColumn>{item.status}</TableRowColumn>
      </TableRow>
    )
  }

  render() {
    const style = {
      button: {
        color: 'orange',
        margin: 12
      },
      aboutContainer: {
        textAlign: 'center',
        marginTop: 60
      },
      loadingContainer: {
        marginTop: 100,
        fontSize: 16
      },
      aboutContainerParagraph: {
        fontSize: 12
      }
    }

    let { about, students = [], processedStudents = [], loading, dirty, firstName, lastName } = this.state;

    return (<div>
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar
            title="Les Honorables"
            iconElementLeft={about ? <IconButton onClick={this.handleArrowClick.bind(this)}><ArrowBack /></IconButton> : <IconButton />}
            iconElementRight={<Settings handleClick={this.handleMenuClick.bind(this)}/>}
            />
          <br />
          { about
            ?
            <div style={style.aboutContainer}>
              <h2>About</h2>
              <p style={style.aboutContainerParagraph}>You can check and drop a star on the Github repository:</p>
              <br />
              <a style={style.aboutContainerParagraph} href="https://www.github.com/cagdass/les-honorables">github.com/cagdass/les-honorables</a>
              <br />
              <p style={style.aboutContainerParagraph}>{"Suggestions are welcome. Be like Ani!"}</p>
            </div>
            :
            <div>
              <div style={styles.container}>
                <p>{"Type in the name of a Bilkent Student and witness their academic prowess"}</p>
                <br />
                <TextField
                  hintText="First name"
                  defaultValue={firstName}
                  onKeyPress={this.handleKeyPress.bind(this)}
                  onChange={this.handleFirstNameChange.bind(this)}
                />
                <br />
                <TextField
                  hintText="Last name"
                  defaultValue={lastName}
                  onKeyPress={this.handleKeyPress.bind(this)}
                  onChange={this.handleLastNameChange.bind(this)}
                />
                <br />
                <br />
                <RaisedButton onClick={this.handleHonorClick.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} label="Find l'honorable" backgroundColor="orange" labelColor="white" style={style.button} />
              </div>
              <div>
                {loading && <div style={styles.container}><p style={style.loadingContainer}>Loading...</p></div>}
                {processedStudents && processedStudents.length > 0 &&

                  processedStudents.map(this.renderStudent.bind(this))}
                {!loading && dirty && processedStudents && processedStudents.length == 0 && <div style={styles.container}><p style={style.loadingContainer}>No result</p></div>}
              </div>
            </div>
          }
        </div>
      </MuiThemeProvider>
    </div>
    );
  }
}

export default Main;
