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
  constructor(props, context) {
    super(props, context);

    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);

    this.state = {
      about: false,
      open: false,
    };
  }

  findStudents(firstName, lastName) {
    return service.searchStudents(firstName, lastName)
        .then(students => {
            this.setState({"students": students});
        })
        .catch(searchError => this.setState({searchError}));
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  handleTouchTap() {
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

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      let { firstName, lastName } = this.state;
      this.findStudents(firstName, lastName);
    }
  }

  handleHonorClick() {
    let { firstName, lastName } = this.state;
    this.findStudents(firstName, lastName);
  }

  getSemester(semester) {
    var suffix = semester.substring(0,4);
    if(semester[4] === '1') {
      return suffix + " Fall";
    }
    else {
      return suffix + " Spring";
    }
  }

  render() {
    const style = {
      button: {
        color: 'orange',
        margin: 12
      },
      aboutContainer: {
        marginTop: 60
      }
    }

    let { about, students } = this.state;

    return (<div>
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <AppBar
            title="Les Honorables"
            iconElementLeft={about ? <IconButton onClick={this.handleArrowClick.bind(this)}><ArrowBack /></IconButton> : <IconButton />}
            iconElementRight={<Settings handleClick={this.handleMenuClick.bind(this)}/>}
          />
        <br />
        <p>{"Type in the name of a Bilkent Student and witness their academic excellence"}</p>
        { about
          ?
          <div style={style.aboutContainer}>
            <h2>About Les Honorables</h2>
            <p>You can check and drop a star on the Github repository:</p>
            <br />
            <a href="https://www.github.com/cagdass/les-honorables">github.com/cagdass/les-honorables</a>
          </div>
          :
          <div>
            <br />
            <TextField
              hintText="First name"
              onKeyPress={this.handleKeyPress.bind(this)}
              onChange={this.handleFirstNameChange.bind(this)}
            />
            <br />
            <TextField
              hintText="Last name"
              onKeyPress={this.handleKeyPress.bind(this)}
              onChange={this.handleLastNameChange.bind(this)}
            />
            <br />
            <br />
            <RaisedButton onClick={this.handleHonorClick.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} label="Find l'honorable" backgroundColor="orange" labelColor="white" style={style.button} />
            {students && students.length > 0 && <Table
              selectable={false}
              multiSelectable={false}
              >
              <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}
                enableSelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>Department</TableHeaderColumn>
                  <TableHeaderColumn>Status</TableHeaderColumn>
                  <TableHeaderColumn>Semester</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                displayRowCheckbox={false}
                showRowHover deselectOnClickaway>
                {students && students.map((student, index) => (
                  <TableRow key={index}>
                    <TableRowColumn>{student.firstName} {student.lastName}</TableRowColumn>
                    <TableRowColumn>{student.department}</TableRowColumn>
                    <TableRowColumn>{student.status}</TableRowColumn>
                    <TableRowColumn>{this.getSemester(student.semester)}</TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>}
          </div>}
        </div>
      </MuiThemeProvider></div>
    );
  }
}

export default Main;
