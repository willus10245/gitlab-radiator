/* eslint-disable react/no-did-mount-set-state */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fetchLatestPipelinesWithCommits } from './services';
import './Project.css';
import './GitLab.css';

class Project extends Component {
  constructor(props) {
    super(props);
    this.fetch = this.fetch.bind(this);
    this.state = {
      pipelines: [],
      interval: null
    };
  }

  componentDidMount() {
    const tenSecondsInMillis = 10 * 1000;
    const interval = setInterval(this.fetch, tenSecondsInMillis);
    this.setState(() => ({ interval }));
    this.fetch();
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  fetch() {
    fetchLatestPipelinesWithCommits(this.props.project)
      .then(pipelines => this.setState(() => ({ pipelines })));
  }

  render() {
    return (
      <div className={`project columns-${this.state.pipelines.length}`} xs="auto">
        <h1>{this.props.project.name}</h1>
        <div className="pipelines">
          {this.state.pipelines.map(pipeline => (
            <div key={pipeline.id} className={`pipeline ${pipeline.status}`}>
              <h2>{pipeline.ref}</h2>
              <h4>{pipeline.commit.author_name}</h4>
              <p>{pipeline.commit.message}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

Project.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    refs: PropTypes.arrayOf(PropTypes.string),
    sha: PropTypes.string
  })
};

Project.defaultProps = {
  project: {
    name: 'No project name defined',
    id: 'No project id defined',
    refs: []
  }
};

export default Project;
