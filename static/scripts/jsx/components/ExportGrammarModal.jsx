var React = require('react')
var Modal = require('react-bootstrap').Modal
var FormGroup = require('react-bootstrap').FormGroup
var FormControl = require('react-bootstrap').FormControl
var ControlLabel = require('react-bootstrap').ControlLabel
var HelpBlock = require('react-bootstrap').HelpBlock
var FileList = require('./FileList.jsx')
var ajax = require('jquery').ajax
import Button from 'react-bootstrap-button-loader';

class ExportGrammarModal extends React.Component {

    constructor(props) {
        super(props);
        this.getFileNames = this.getFileNames.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateGrammarName = this.updateGrammarName.bind(this);
        this.setExportButtonStyle = this.setExportButtonStyle.bind(this);
        this.checkExportGrammarName = this.checkExportGrammarName.bind(this);
        this.checkDisableExportButton = this.checkDisableExportButton.bind(this);
        this.exportBundleOnEnter = this.exportBundleOnEnter.bind(this);
        this.state = {
            grammarFileNames: [],
            height: '400px',
            disableExportButton: false,
            validationState: 'success',
            getCurrentGrammarName: this.props.getCurrentGrammarName,
            setCurrentGrammarName: this.props.setCurrentGrammarName
        };
    }

    getFileNames(onSuccess) {
        ajax({
            url: $SCRIPT_ROOT + '/api/grammar/load_dir',
            type: "GET",
            cache: false,
            success: onSuccess
        })
    }

    componentWillMount(){
        this.getFileNames((data) => { this.setState({'grammarFileNames': data.results}) })
    }

    handleChange(e){
        if (e.key !== 'Enter') {
            this.state.setCurrentGrammarName(e.target.value);
        }
    }

    exportBundleOnEnter(e) {
        if (this.props.show) {
            if (e.key === 'Enter' && !(e.ctrlKey || e.metaKey)) {
                document.getElementById("exportButton").click();
                e.preventDefault();
            }
        }
    };

    updateGrammarName(filename){
        this.state.setCurrentGrammarName(filename);
    }

    setExportButtonStyle(){
        if (this.props.exportButtonIsJuicing) {
            return 'success'
        }
        else if (this.checkExportGrammarName() == 'error'){
            return 'danger'
        }
        else {
            return this.checkExportGrammarName();
        }
    }

    checkDisableExportButton(){
        if (this.checkExportGrammarName() == 'error'){
            return true
        } else {
            return false
        }
    }

    checkExportGrammarName() {
        if (this.state.grammarFileNames.indexOf(this.state.getCurrentGrammarName()) > -1){
            return 'warning'
        } else if (this.state.getCurrentGrammarName() == '') {
            return 'error'
        }
        return null
    }

    componentDidMount(){
        document.addEventListener("keydown", this.exportBundleOnEnter, false);
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Export content bundle...</Modal.Title>
                </Modal.Header>
                <div style={{padding: '15px'}}>
                    <form>
                        <FormGroup controlId="exportGrammarForm" validationState={this.checkExportGrammarName()}>
                            <ControlLabel>Bundle name</ControlLabel>
                            <FormControl type="text" value={this.state.getCurrentGrammarName()} placeholder="Enter a name for your content bundle." onChange={this.handleChange} autoFocus="true"/>
                            <FormControl.Feedback />
                            <HelpBlock><i>Content bundles are exported to /exports. Exporting will overwrite files with the same bundle name.</i></HelpBlock>
                        </FormGroup>
                    </form>
                    <FileList onFileClick={this.updateGrammarName} highlightedFile={this.state.getCurrentGrammarName()} height='200px' directory='exports'></FileList>
                    <Button id="exportButton" title={this.props.exportButtonSpinnerOn ? "Exporting content bundle (to /exports)..." : "Export content bundle (to /exports)"} onClick={this.props.exportGrammar} type="submit" style={{marginTop: '15px'}} bsStyle={this.setExportButtonStyle()} spinColor="#000" loading={this.props.exportButtonSpinnerOn} disabled={this.checkDisableExportButton()}>{this.props.exportButtonSpinnerOn ? 'Exporting...' : this.props.exportButtonIsJuicing ? 'Exported!' : 'Export'}</Button>
                </div>
            </Modal>

        )
    }
}

module.exports = ExportGrammarModal;
