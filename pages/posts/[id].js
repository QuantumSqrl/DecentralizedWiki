import fs from 'fs';
import path from 'path';
import utilStyles from '../../styles/utils.module.css';
import Layout from '../../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import Head from 'next/head';
import Date from '../../components/date';
import React, { useState } from 'react';
import { Formik } from 'formik';
import { Form, Field, ErrorMessage } from 'formik';
import { render } from 'react-dom';
import {Web3Storage} from 'web3.storage';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, push, update, onValue } from "firebase/database";
import { LineAxisOutlined } from '@mui/icons-material';
import axios from 'axios';

const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://wikitechtree-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);

const client = new Web3Storage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFFN0MxRDM3NmQ5MEYzNEVkODcwMGQyQzEzNGIzOWM2RkIzMGJlY2UiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTI3MzU4MTg1NTIsIm5hbWUiOiJPcGVuUmVjb24ifQ.g0cEihs9Uh-3CjRTYmIhjsow0w669vtmlf-48xdcRbY'});

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
    const paths = getAllPostIds();
    return {
      paths,
      fallback: false,
    };
}

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editFlag: 0,
      id: '',
      cid: 0,
      content: '',
      newData: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({newData: event.target.value});
  }

  async handleSubmit(event) {
    // alert('An edit was submitted: ' + this.state.newData);
    event.preventDefault();

    /// this works, but need to 
    /// 1. save as md, not json
    const str = JSON.stringify(this.state.newData, null, 2);
    const file = new File([str], 'data.json', {type: 'application/json'});
    const cid = await client.put([file], {wrapWithDirectory: false});
    // console.log(cid);
    this.setState({id: cid});
    this.saveCID(cid);
  }

  async saveCID(cid) {
    const db = getDatabase();
  
    // A post entry.
    const postData = {
      id: cid // later on, id should be the editors's username
    };
  
    // Get a key for a new Post.
    // var current = new Date();
    // const newPostKey = current.toLocaleString();
  
    // Write the new post's data in the posts list 
    const updates = {};
    // updates['/posts/' + newPostKey] = postData;
    updates[this.props.postData.id] = postData;
  
    return update(ref(db), updates);
  }

  async getCID(id) {
    const db = getDatabase();
    const postRef = ref(db, id);

    return new Promise((resolve) => {
      onValue(postRef, (snapshot) => {
        const data = snapshot.val();
        console.log("CID: " + data['id']);
        resolve(data['id']);
      });
    })
  }
  
  async getData(cid) {
    console.log("1");
    const url = 'https://' + cid + '.ipfs.dweb.link';
    const res = await this.getIPFS(url);
    if (res == undefined) {
      return "Error! Please try again.";
    }
    return res.toString();
  
  }
  
  async getIPFS(url) {
    try {
      const response = await axios.get(url);
  
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  async admin() {
    const cid = await this.getCID(this.props.postData.id, this.getData);

    const ipfs = await this.getData(cid);

    this.setState({content: ipfs});
    this.setState({newData: ipfs});
  }

  render() {
    // call the cid and ipfs stuff, if !data, render a loading thing, if data then do the thing already here
    /// CID and actual article info processing
    this.admin();

    if(!this.state.content) {
      return (
        <Layout>
        <Head>
          <title>{this.props.postData.title}</title>
        </Head>
        <article>
          <h1 className={utilStyles.headingXl}>{this.props.postData.title}</h1>
          {/* <div className={utilStyles.lightText}>
            <Date dateString={postData.date} />
          </div> */}
          <div dangerouslySetInnerHTML={{ __html: this.props.postData.treeHtml }} />
          <br/>
          <br/>
          <div>Fetching the data from the decentralized web...</div>
          <br/>
          <br/>
          <h1>{this.props.cid}</h1>
        </article>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onClick={() => {this.setState({editFlag: 1})}}>Edit</button>
      </Layout>
      )
    }

    if (this.state.editFlag == 1) {
      return (
        <Layout>
          <Head>
            <title>{this.props.postData.title}</title>
          </Head>
          <h1 className={utilStyles.headingXl}>{this.props.postData.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: this.props.postData.treeHtml }} />
          <br/>
          <br/>

          <form onSubmit={this.handleSubmit} >

            <textarea type="text" value={this.state.newData} onChange={this.handleChange} class="rounded-md appearance-none relative inline-block w-full h-fit px-3 py-2 border border-gray-300 placeholder-gray-500 text-white-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-md"/>
            <br/>
            <br/>
            <br/>
            <input class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" type="submit" value="Submit" />
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 mx-1 rounded" onClick={() => {this.setState({editFlag: 0})}} >Cancel</button>
          </form>


        </Layout>
      )} else {
        return (
          <Layout>
            <Head>
              <title>{this.props.postData.title}</title>
            </Head>
            <article>
              <h1 className={utilStyles.headingXl}>{this.props.postData.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: this.props.postData.treeHtml }} />
              <br/>
              <br/>
              <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
              <br/>
              <br/>
              <h1>{this.props.cid}</h1>
            </article>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onClick={() => {this.setState({editFlag: 1})}}>Edit</button>
          </Layout>
    )}
  }
}
  