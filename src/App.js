import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { Trash, FileEarmarkPlus, QuestionCircle } from 'react-bootstrap-icons';

import Calc from './Calc.js';
import './App.css';
import Geo1 from './geo1.jsx';
import Geo2 from './geo2.jsx';
import Geo1Flat from './geo1flat.jsx';
import Geo2Flat from './geo2flat.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profiles: [
                {
                    name: 'default',
                    dw: '250',
                    lp: '139',
                    beta: '15',
                    ds: '12',
                    dj: '12',
                    o: '50',
                    hc: '30',
                },
            ],
            activeProfile: 0,
            showDeleteConfirm: false,
            showCalibrationReminder: false,
        };
        if (typeof localStorage !== 'undefined') {
            var persistedState = localStorage.getItem('state');
            if (persistedState) {
                this.state = JSON.parse(persistedState);
                this.state.showDeleteConfirm = false;
                this.state.showCalibrationReminder = false;
            }
        }

        this.presets = [
            {
                name: '200 mm Wheel',
                dw: '200',
                lp: '139',
                beta: '15',
                ds: '12',
                dj: '12',
                o: '0',
                hc: '0',
            },
            {
                name: '250 mm Wheel',
                dw: '250',
                lp: '139',
                beta: '15',
                ds: '12',
                dj: '12',
                o: '0',
                hc: '0',
            },
            {
                name: 'T8 vertical USB',
                dw: '250',
                lp: '139',
                beta: '15',
                ds: '12',
                dj: '12',
                o: '50',
                hc: '29',
            },
            {
                name: 'T4',
                dw: '200',
                lp: '139',
                beta: '15',
                ds: '12',
                dj: '12',
                o: '50',
                hc: '20',
            },
            {
                name: '1x30 Flat Platen',
                dw: '0',
                lp: '140',
                beta: '17',
                ds: '12',
                dj: '12',
                o: '0',
                hc: '0',
                flat: true,
                betaCal: '17',
                dCal: '94.6',
            },
            {
                name: '1x30 Flat 15°',
                dw: '0',
                lp: '140',
                beta: '15',
                ds: '12',
                dj: '12',
                o: '0',
                hc: '0',
                flat: true,
                betaCal: '17',
                dCal: '94.6',
            },
            {
                name: '1x30 Flat 17°',
                dw: '0',
                lp: '140',
                beta: '17',
                ds: '12',
                dj: '12',
                o: '0',
                hc: '0',
                flat: true,
                betaCal: '17',
                dCal: '94.6',
            },
            {
                name: '1x30 Flat 20°',
                dw: '0',
                lp: '140',
                beta: '20',
                ds: '12',
                dj: '12',
                o: '0',
                hc: '0',
                flat: true,
                betaCal: '17',
                dCal: '94.6',
            },
            {
                name: '1x30 Flat 25°',
                dw: '0',
                lp: '140',
                beta: '25',
                ds: '12',
                dj: '12',
                o: '0',
                hc: '0',
                flat: true,
                betaCal: '17',
                dCal: '94.6',
            },
        ];

        // Starter profiles used when the mode toggle is flipped into a mode that
        // has no profile yet, so we never rewrite the profile the user is on.
        // The flat template is anchored to a verified per-side measurement
        // (17deg -> 94.6mm at 140mm projection).
        this.wheelDefault = {
            name: 'Wheel',
            dw: '250',
            lp: '139',
            beta: '15',
            ds: '12',
            dj: '12',
            o: '50',
            hc: '30',
        };
        this.flatDefault = {
            name: 'Flat Platen',
            dw: '0',
            lp: '140',
            beta: '17',
            ds: '12',
            dj: '12',
            o: '0',
            hc: '0',
            flat: true,
            betaCal: '17',
            dCal: '94.6',
        };

        this.handleSelect = this.handleSelect.bind(this);
        this.handleModeToggle = this.handleModeToggle.bind(this);
        this.setMode = this.setMode.bind(this);
        this.handleDuplicate = this.handleDuplicate.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleDeleteConfirmClose = this.handleDeleteConfirmClose.bind(this);
        this.handleCalibrationReminderClose = this.handleCalibrationReminderClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.calc = new Calc();
    }

    handleSelect(ev) {
        var target = ev.target;
        var profileIndex = target.getAttribute('data-index');
        const i = parseInt(profileIndex, 10);
        if (i < this.state.profiles.length) {
            this.setState({ activeProfile: i });
        } else {
            var profile = JSON.parse(JSON.stringify(this.presets[i - this.state.profiles.length]));
            this.state.profiles.push(profile);
            this.setState({
                profiles: this.state.profiles,
                activeProfile: this.state.profiles.length - 1
            });
        }
    }

    handleDuplicate() {
        var profile = JSON.parse(JSON.stringify(this.state.profiles[this.state.activeProfile]));
        profile.name += ' (copy)';
        this.state.profiles.push(profile);
        this.setState({
            profiles: this.state.profiles,
            activeProfile: this.state.profiles.length - 1
        });
    }

    handleRemove() {
        if (this.state.profiles.length > 1) {
            this.setState({ showDeleteConfirm: true });
        }
    }

    handleDeleteConfirmClose(confirmed) {
        if (confirmed && this.state.profiles.length > 1) {
            this.state.profiles.splice(this.state.activeProfile, 1);
            var i = this.state.activeProfile;
            if (i >= this.state.profiles.length) {
                i = this.state.profiles.length - 1;
            }
            this.setState({
                profiles: this.state.profiles,
                activeProfile: i
            });
        }
        this.setState({ showDeleteConfirm: false });
    }

    handleChange(ev) {
        const target = ev.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var profile = this.state.profiles[this.state.activeProfile];
        profile[name] = value;
        this.setState({ profiles: this.state.profiles });
    }

    handleModeToggle(ev) {
        this.setMode(ev.target.checked);
    }

    setMode(value) {
        // The top control is a mode selector (round wheel vs. flat belt sander),
        // not a per-profile field. Choosing a mode should land you on a profile
        // that matches it so the fields and calculations stay consistent.
        const profiles = this.state.profiles;
        const active = this.state.activeProfile;

        // Already in the requested mode (e.g. clicking the active label): no-op.
        if (!!profiles[active].flat === value) {
            return;
        }

        // Entering flat mode? Nudge the user to the one-time calibration in
        // Machine Settings so the reported angles are trustworthy.
        const remind = value;

        // Prefer an existing profile of the chosen mode...
        const match = profiles.findIndex((p, i) => i !== active && !!p.flat === value);
        if (match >= 0) {
            this.setState({ activeProfile: match, showCalibrationReminder: remind });
            return;
        }

        // ...otherwise create a fresh starter profile for that mode. We never
        // rewrite the current profile, so a wheel setup can't silently become a
        // flat one (or vice versa).
        const template = value ? this.flatDefault : this.wheelDefault;
        profiles.push(JSON.parse(JSON.stringify(template)));
        this.setState({
            profiles: profiles,
            activeProfile: profiles.length - 1,
            showCalibrationReminder: remind,
        });
    }

    handleCalibrationReminderClose() {
        this.setState({ showCalibrationReminder: false });
    }

    handleSubmit(ev) {
        ev.preventDefault();
    }

    componentDidUpdate() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('state', JSON.stringify(this.state));
        }
    }

    render() {
        const profile = this.state.profiles[this.state.activeProfile];
        this.calc.set(profile);
        const c = this.calc.get();

        // Only show profiles and presets that match the current mode (round
        // wheel vs. flat platen), so the list always lines up with the toggle.
        const flatMode = !!profile.flat;
        var selectItems = [];

        var myProfileItems = [];
        this.state.profiles.forEach((p, index) => {
            if (!!p.flat !== flatMode) {
                return;
            }
            myProfileItems.push(
                <Dropdown.Item active={index === this.state.activeProfile} data-index={index} onClick={this.handleSelect} key={'profile-'+index}>
                    {p.name}
                </Dropdown.Item>
            );
        });
        if (myProfileItems.length > 0) {
            selectItems.push(<Dropdown.Header key={'my-profiles'}>my Profiles</Dropdown.Header>);
            myProfileItems.forEach((item) => selectItems.push(item));
        }

        var presetItems = [];
        this.presets.forEach((p, index) => {
            if (!!p.flat !== flatMode) {
                return;
            }
            presetItems.push(
                <Dropdown.Item data-index={this.state.profiles.length + index} onClick={this.handleSelect} key={'preset-'+index}>
                    {p.name}
                </Dropdown.Item>
            );
        });
        if (presetItems.length > 0) {
            if (selectItems.length > 0) {
                selectItems.push(<Dropdown.Divider key={'divider'} />);
            }
            selectItems.push(<Dropdown.Header key={'presets'}>add Preset</Dropdown.Header>);
            presetItems.forEach((item) => selectItems.push(item));
        }

        return (
            <Container>
                <Form onSubmit={this.handleSubmit}>
                    <Row className="my-4">
                        <Col sm="4">
                            <Dropdown>
                                <Dropdown.Toggle id="machine" size="lg" className="app-shadow">
                                    Profiles
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="app-shadow">
                                    {selectItems}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col sm="8">
                            <InputGroup className="app-shadow">
                                <Form.Control size="lg" type="text" name="name" value={profile.name} onChange={this.handleChange} />
                                <Button variant="success" size="lg" title="duplicate" onClick={this.handleDuplicate}>&nbsp;<FileEarmarkPlus />&nbsp;</Button>
                                <Button variant="danger" size="lg" title="remove" onClick={this.handleRemove} disabled={this.state.profiles.length <= 1}>&nbsp;<Trash />&nbsp;</Button>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col>
                            <div className="d-flex align-items-center">
                                <span
                                    className={!profile.flat ? 'fw-semibold text-primary' : 'text-muted'}
                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                    onClick={() => this.setMode(false)}
                                >
                                    Round Wheel
                                </span>
                                <Form.Check
                                    type="switch"
                                    id="flat-switch"
                                    name="flat"
                                    className="mx-2"
                                    aria-label="Switch between Round Wheel and Flat Platen modes"
                                    checked={!!profile.flat}
                                    onChange={this.handleModeToggle}
                                />
                                <span
                                    className={profile.flat ? 'fw-semibold text-primary' : 'text-muted'}
                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                    onClick={() => this.setMode(true)}
                                >
                                    Flat Platen (belt sander)
                                </span>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                        <Tooltip id="flat-tooltip">
                                            Switch grinding modes &ndash; <strong>Round Wheel</strong> for a
                                            Tormek-style wheel, or <strong>Flat Platen</strong> for a belt
                                            sander or any flat grinding surface. Click the switch or either label.
                                        </Tooltip>
                                    }
                                >
                                    <span className="ms-2 text-muted d-inline-flex" style={{ cursor: 'help' }}>
                                        <QuestionCircle />
                                    </span>
                                </OverlayTrigger>
                            </div>
                            <Form.Text className="text-muted d-block mt-1">
                                You're in <strong>{profile.flat ? 'Flat Platen' : 'Round Wheel'}</strong> mode
                                &mdash; click to switch.
                            </Form.Text>
                        </Col>
                    </Row>
                    <Card className="mb-4">
                        <Card.Header>
                            Sharpening Angle
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col lg={3} className="mb-2">
                                    {profile.flat ? <Geo1Flat /> : <Geo1 />}
                                </Col>
                                <Col lg={9}>
                                    {!profile.flat &&
                                        <Form.Group as={Row} controlId="dw">
                                            <Form.Label column sm={3}>Wheel Diameter</Form.Label>
                                            <Col sm={9}>
                                                <InputGroup>
                                                    <InputGroup.Text>d<sub>w</sub></InputGroup.Text>
                                                    <Form.Control type="text" name="dw" value={profile.dw} onChange={this.handleChange} />
                                                    <InputGroup.Text>mm</InputGroup.Text>
                                                </InputGroup>
                                            </Col>
                                        </Form.Group>
                                    }
                                    <Form.Group as={Row} controlId="lp">
                                        <Form.Label column sm={3}>Projection Distance</Form.Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroup.Text>l<sub>p</sub></InputGroup.Text>
                                                <Form.Control type="text" name="lp" value={profile.lp} onChange={this.handleChange} />
                                                <InputGroup.Text>mm</InputGroup.Text>
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="beta">
                                        <Form.Label column sm={3}>Grind Angle</Form.Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroup.Text>β</InputGroup.Text>
                                                <Form.Control type="text" name="beta" value={profile.beta} onChange={this.handleChange} />
                                                <InputGroup.Text>°</InputGroup.Text>
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="hr">
                                        <Form.Label column sm={3}>{profile.flat ? 'Bar Distance' : 'Wheel Distance'}</Form.Label>
                                        <Col sm={9}>
                                            <InputGroup>
                                                <InputGroup.Text>h<sub>r</sub></InputGroup.Text>
                                                <Form.Control type="text" readOnly placeholder={c.hr} />
                                                <InputGroup.Text>mm</InputGroup.Text>
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>
                                    {profile.hc > 0 &&
                                        <Form.Group as={Row} controlId="hn">
                                            <Form.Label column sm={3}>Case Distance</Form.Label>
                                            <Col sm={9}>
                                                <InputGroup>
                                                    <InputGroup.Text>h<sub>n</sub></InputGroup.Text>
                                                    <Form.Control type="text" readOnly placeholder={c.hn} />
                                                    <InputGroup.Text>mm</InputGroup.Text>
                                                </InputGroup>
                                            </Col>
                                        </Form.Group>
                                    }
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Card className="mb-4">
                        <Card.Header>
                            Machine Settings
                                </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col lg={3} className="mb-2">
                                    {profile.flat ? <Geo2Flat /> : <Geo2 />}
                                </Col>
                                <Col lg={9}>
                                    {profile.flat &&
                                        <>
                                            <Form.Text className="text-muted d-block mb-3">
                                                Calibrate once: grind a bevel, measure the angle you
                                                actually got and the bar distance you used, and enter
                                                them below. This captures the platen tilt, bar/jig
                                                sizes and your measuring reference automatically.
                                            </Form.Text>
                                            <Form.Group as={Row} controlId="betaCal">
                                                <Form.Label column sm={3}>Calibration Angle</Form.Label>
                                                <Col sm={9}>
                                                    <InputGroup>
                                                        <InputGroup.Text>β<sub>cal</sub></InputGroup.Text>
                                                        <Form.Control type="text" name="betaCal" value={profile.betaCal || ''} onChange={this.handleChange} />
                                                        <InputGroup.Text>°</InputGroup.Text>
                                                    </InputGroup>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} controlId="dCal">
                                                <Form.Label column sm={3}>Calibration Distance</Form.Label>
                                                <Col sm={9}>
                                                    <InputGroup>
                                                        <InputGroup.Text>D<sub>cal</sub></InputGroup.Text>
                                                        <Form.Control type="text" name="dCal" value={profile.dCal || ''} onChange={this.handleChange} />
                                                        <InputGroup.Text>mm</InputGroup.Text>
                                                    </InputGroup>
                                                </Col>
                                            </Form.Group>
                                        </>
                                    }
                                    {!profile.flat &&
                                        <Form.Group as={Row} controlId="ds">
                                            <Form.Label column sm={3}>Support Bar Diameter</Form.Label>
                                            <Col sm={9}>
                                                <InputGroup>
                                                    <InputGroup.Text>d<sub>s</sub></InputGroup.Text>
                                                    <Form.Control type="text" name="ds" value={profile.ds} onChange={this.handleChange} />
                                                    <InputGroup.Text>mm</InputGroup.Text>
                                                </InputGroup>
                                            </Col>
                                        </Form.Group>
                                    }
                                    {!profile.flat &&
                                        <Form.Group as={Row} controlId="dj">
                                            <Form.Label column sm={3}>Knife Jig Diameter</Form.Label>
                                            <Col sm={9}>
                                                <InputGroup>
                                                    <InputGroup.Text>d<sub>j</sub></InputGroup.Text>
                                                    <Form.Control type="text" name="dj" value={profile.dj} onChange={this.handleChange} />
                                                    <InputGroup.Text>mm</InputGroup.Text>
                                                </InputGroup>
                                            </Col>
                                        </Form.Group>
                                    }
                                    {!profile.flat &&
                                        <Form.Group as={Row} controlId="o">
                                            <Form.Label column sm={3}>Support Bar Offset</Form.Label>
                                            <Col sm={9}>
                                                <InputGroup>
                                                    <InputGroup.Text>o</InputGroup.Text>
                                                    <Form.Control type="text" name="o" value={profile.o} onChange={this.handleChange} />
                                                    <InputGroup.Text>mm</InputGroup.Text>
                                                </InputGroup>
                                            </Col>
                                        </Form.Group>
                                    }
                                    {!profile.flat &&
                                        <Form.Group as={Row} controlId="hc">
                                            <Form.Label column sm={3}>Case Height</Form.Label>
                                            <Col sm={9}>
                                                <InputGroup>
                                                    <InputGroup.Text>h<sub>c</sub></InputGroup.Text>
                                                    <Form.Control type="text" name="hc" value={profile.hc} onChange={this.handleChange} />
                                                    <InputGroup.Text>mm</InputGroup.Text>
                                                </InputGroup>
                                            </Col>
                                        </Form.Group>
                                    }
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Row className="mb-4">
                    </Row>
                </Form>
                <Modal show={this.state.showCalibrationReminder} onHide={this.handleCalibrationReminderClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Calibrate your flat platen</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Flat-platen mode needs a one-time calibration for your rig. Head to
                        the <strong>Machine Settings</strong> card below, get the angle of your jig and the
                        total distance the bar is extended,
                        then enter the <strong>Calibration Angle</strong> and{' '}
                        <strong>Calibration Distance</strong> you actually measured. This
                        captures your platen tilt, bar/jig sizes and measuring reference so
                        the sharpening angles come out right.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleCalibrationReminderClose}>
                            Got it
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showDeleteConfirm} onHide={this.handleDeleteConfirmClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete the current profile?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleDeleteConfirmClose(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => this.handleDeleteConfirmClose(true)}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}

export default App;
