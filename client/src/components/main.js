/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, { Component, PropTypes } from 'react';
import { AppBar, MenuItem, IconMenu, IconButton, TextField, RaisedButton, DropDownMenu } from 'material-ui';
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

  searchStudents(firstName, lastName, department) {
      return baseAPI.get("student?firstName=" + firstName  + "&lastName=" + lastName + "&department=" + department).catch(error => {
          console.error(error);
          return null;
      })
  }

  searchDepartments() {
    return baseAPI.get("departments").catch(error => {
      console.error(error);
      return null;
    })
  }

	getTopStudents() {
		return baseAPI.get('top_students')
			.catch(error => {
				console.error(error);
				return [];
			});
	}
}
	
var service = new Service();

const styles = {
  container: {
    textAlign: 'center',
  },
  leProwess: {
      fontSize: 15,
  },
	wallOfFame: {
		fontSize: 18,
	},
	topSearched: {
		fontSize: 10,
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
    let _department = params.department ||  "ALL";
    let _departments = [<MenuItem value="ALL" key="ALL" primaryText={`All departments`} />];

    this.state = {
      about: false,
      open: false,
      loading: false,
      dirty: false,
      firstName: _firstName,
      lastName: _lastName,
      department: _department,
      departments: _departments,
      students: [],
		processedStudents: [],
		topStudents: [],
    };
  }

  componentWillMount() {
    let { router } = this.context;

    console.log("Router");
    console.log(router);
  }

  componentDidMount() {
    let { firstName, lastName, department } = this.state;

    if (firstName || lastName) {
      this.findStudents(firstName, lastName, department);
    }

      this.findDepartments();
	  this.getTopStudents();
  }

	getTopStudents() {
		return service.getTopStudents()
			.then(topStudents => {
				this.setState({ topStudents });
			})
			.catch(error => {
				this.setState({ topStudents: [] });
			});					
	}

  findStudents (firstName, lastName, department) {
    return service.searchStudents(firstName, lastName, department)
        .then(students => {
            this.setState({"loading": false, "students": students});
            this.processStudents();
        })
        .catch(searchError => this.setState({searchError}));
  }

  findDepartments () {
    let items = [<MenuItem value="ALL" key="ALL"primaryText={`All departments`} />];

    return service.searchDepartments()
      .then(departments => {
        departments.sort();
        for (var i = 0; i < departments.length; i++) {
          var dept = departments[i];
          items.push(<MenuItem value={dept} key={dept} primaryText={`${dept}`} />)
        }
        this.setState({"departments": items})
      })
      .catch(error => { console.error(error) } );
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
            processedStudents[s].department = students[i].department;
            // Add the found semester and the honor status to the student's record.
            processedStudents[s].semesters.push({
              'status': students[i].status,
              'semester': students[i].semester,
              'department': students[i].department
            });
          }
      }

      if (!found) {
        processedStudents.push({
          'firstName': students[i].firstName,
          'lastName': students[i].lastName,
          'semesters': []
        })

        processedStudents[processedStudents.length - 1].semesters.push({
          'status': students[i].status,
          'semester': students[i].semester,
          'department': students[i].department
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

  handleDepartmentChange (event, index, value) {
    let { firstName, lastName } = this.state;
    this.context.router.push({
      query: {
        "firstName": firstName,
        "lastName": lastName,
        "department": value
      }
    });
    this.setState({"department": value});
  }

  handleFirstNameChange(e) {
    let firstName = e.target.value;
    let { lastName, department } = this.state;
    this.context.router.push({
      query: {
        "firstName": firstName,
        "lastName": lastName,
        "department": department
      }
    });
    this.setState({"firstName": firstName});
  }

  handleLastNameChange(e) {
    let lastName = e.target.value;
    let { firstName, department } = this.state;
    this.context.router.push({
      query: {
        "firstName": firstName,
        "lastName": lastName,
        "department": department
      }
    });
    this.setState({"lastName": lastName});
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
      let { firstName, lastName, department } = this.state;
      let firstName_ = firstName.trim();
      let lastName_ = lastName.trim();
      this.setState({
        "firstName": firstName_,
        "lastName": lastName_
      })
      this.handleSubmit();
      this.findStudents(firstName_, lastName_, department);
    }
  }

  handleHonorClick() {
    let { firstName, lastName, department } = this.state;
    let firstName_ = firstName.trim();
    let lastName_ = lastName.trim();
    this.setState({
      "firstName": firstName_,
      "lastName": lastName_
    })
    this.handleSubmit();
    this.findStudents(firstName_, lastName_, department);
  }

  getSemester (semester) {
    var suffix = semester.substring(0,4);
    if (semester[4] === '1') {
      return suffix + " Fall";
    }
    else {
      return (Number(suffix) + 1) + " Spring";
    }
  }

	renderTopStudents() {
		const { topStudents = [] } = this.state;

		return (
			<Table
			  selectable={false}
			  multiSelectable={false}
			  >
			  <TableHeader
				displaySelectAll={false}
				adjustForCheckbox={false}
				enableSelectAll={false}>
				<TableRow>
				  <TableHeaderColumn colSpan="1">Name</TableHeaderColumn>
				  <TableHeaderColumn colSpan="2">Yarışmaya nereden katılıyor</TableHeaderColumn>
				  <TableHeaderColumn colSpan="1">Times searched</TableHeaderColumn>
				</TableRow>
			  </TableHeader>
			  <TableBody
				deselectOnClickaway
				displayRowCheckbox={false}
				showRowHover
			  >
				{topStudents.map(student => {
					const {
						departments,
						firstName,
						lastName,
						score,
					} = student;
					
					return (
						<TableRow>
						  <TableRowColumn colSpan="1">
							{firstName + ' ' + lastName}
						  </TableRowColumn>
						  <TableRowColumn colSpan="2">{departments.join(',')}</TableRowColumn>
						  <TableRowColumn colSpan="1">{score}</TableRowColumn>
						</TableRow>
					);
			   })}
			  </TableBody>
			</Table>
		);
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
              <TableHeaderColumn colSpan="1">Semester</TableHeaderColumn>
              <TableHeaderColumn colSpan="1">Status</TableHeaderColumn>
              <TableHeaderColumn colSpan="1">Department</TableHeaderColumn>
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
        <TableRowColumn colSpan="1">{this.getSemester(item.semester)}</TableRowColumn>
        <TableRowColumn colSpan="1">{item.status}</TableRowColumn>
        <TableRowColumn colSpan="1">{item.department}</TableRowColumn>
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
        fontSize: 18
      },
      aboutContainerParagraph: {
        fontSize: 15
      },
      logoStyle: {
        paddingRight: 45,
        paddingTop: 2,
        paddingBottom: 5
      }
    }

    let { about, students = [], processedStudents = [], loading, dirty, firstName, lastName, departments = ["ALL"] } = this.state;
    const logoImage = require('../../assets/images/logo.png');

    return (<div>
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar
            title="Les Honorables"
            iconElementLeft={about
              ? <IconButton onClick={this.handleArrowClick.bind(this)}><ArrowBack /></IconButton>
            : <IconButton style={style.logoStyle}><img  src={logoImage} /></IconButton>}
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
              <p style={style.aboutContainerParagraph}>{"Suggestions are welcome. Be like Ani! (actually don't :p)"}</p>
              <br />
              <p style={style.aboutContainerParagraph}>{"Lastly, feel free to donate. Even petty coins are appreciated, I am the the long haired, hijab wearing man on the campus."}</p>
            </div>
            :
            <div>
            <div style={styles.container}>
			<p style={styles.wallOfFame}>
			Le Wall de Fame			
			</p>
			<p style={styles.topStudents}>
			(most searched pupils)
			</p>
			{this.renderTopStudents()}
                <p style={styles.leProwess}>{"Type in the name of a Bilkent Student and witness their academic prowess"}</p>
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
                <DropDownMenu maxHeight={300} value={this.state.department} onChange={this.handleDepartmentChange.bind(this)}>
                  {departments}
                </DropDownMenu>
                <br />
                <br />
                <RaisedButton onClick={this.handleHonorClick.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} label="Fetchez l'honorable" backgroundColor="orange" labelColor="white" style={style.button} />
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

Main.contextTypes = {
  router: PropTypes.object
};

export default Main;
