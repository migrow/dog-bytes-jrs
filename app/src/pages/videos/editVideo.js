import React from 'react'
import { connect } from 'react-redux'
import MenuAppBar from '../../components/MenuAppBar'
import { FormControl } from 'material-ui/Form'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'
import { compose, uniq, flatten, map, isEmpty, path, head } from 'ramda'
import {
  editVideoField,
  editVideo,
  cancelEdit,
  deleteVideo,
  getVideo
} from '../../action-creators/videos'
import {
  TOGGLE_DELETE,
  EDIT_FORM_ADD_CHIP,
  EDIT_FORM_DELETE_CHIP,
  CREATE_TAG,
  CLEAR_NEW_TAG,
  NEW_TAG_TEXT,
  CHANGE_PHOTO
} from '../../constants'
import { ChipGroup } from '../../components/ChipGroup'
import Divider from 'material-ui/Divider'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import FileInput from '../../components/FileInput'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: 'flex'
  }
})

const EditVideo = props => {
  const { classes } = props
  const videoTags = compose(uniq, flatten, map(video => video.tags))(
    props.videos
  )
  const id = props.match.params.id
  if (isEmpty(props.video)) {
    return (
      <Button onClick={props.retry(props.history, id)}>Refresh Data</Button>
    )
  }
  return (
    <div>
      <center>
        <MenuAppBar title="Edit Video" />
      </center>
      <form style={{ paddingTop: '55px', paddingLeft: '15px' }}>
        <FormControl noValidate autoComplete="off">
          <TextField
            id="name"
            label="Name"
            margin="normal"
            value={props.video.name}
            onChange={e => props.onChange('name', e.target.value)}
          />
          <TextField
            id="desc"
            label="Description"
            margin="normal"
            value={props.video.desc}
            onChange={e => props.onChange('desc', e.target.value)}
          />
          <TextField
            id="url"
            label="Youtube Video URL"
            margin="normal"
            value={props.video.youTubeVideoURL}
            onChange={e => props.onChange('url', e.target.value)}
          />
          <TextField
            id="date"
            label="Date"
            margin="normal"
            value={props.video.date}
            helperText="Enter Date in MM/DD/YY Format"
            onChange={e => props.onChange('date', e.target.value)}
          />
          <TextField
            id="notes"
            label="Notes"
            margin="normal"
            value={props.video.notes}
            onChange={e => props.onChange('notes', e.target.value)}
          />
          <ChipGroup
            data={videoTags}
            click={props.handleClick}
            category="Difficulty"
            video={props.video}
            onDelete={props.handleDelete}
          />
          <ChipGroup
            data={videoTags}
            click={props.handleClick}
            category="Stack"
            video={props.video}
            onDelete={props.handleDelete}
          />
          <div className={classes.root}>
            <ChipGroup
              data={videoTags}
              click={props.handleClick}
              category="Content"
              video={props.video}
              onDelete={props.handleDelete}
            />
          </div>
          <div>
            <Typography paragraph variant="body2">
              {`Don't see a tag you want? Add it below!`}
            </Typography>
            <TextField
              id="Content"
              label="New Content"
              category="Content"
              margin="normal"
              helperText="What tag would you like to add?"
              onChange={e => props.newTagText('Content', e.target.value)}
            />
            <Button onClick={props.createTag(props.newTag)}>Add New Tag</Button>
          </div>
        </FormControl>
        <div>
          <br />
          <FileInput onChange={props.handlePhoto}>
            <img
              style={{ maxWidth: '75px' }}
              alt="video screenshot"
              src={
                props.video.imgPath
                  ? props.video.imgPath
                  : "https://placehold.it/64x64?text='photo'"
              }
            />
            <Button
              variant="flat"
              component="span"
              color="primary"
              style={{ margin: '5px' }}
            >
              Upload Photo
            </Button>
          </FileInput>
        </div>
        <Divider />
        <br />
        <div>
          <Button
            color="secondary"
            style={{ backgroundColor: 'black', margin: '5px' }}
            onClick={props.onSubmit(props.history, props.video)}
          >
            Submit
          </Button>
          <Button
            color="primary"
            style={{ backgroundColor: '#EAEDED', margin: '5px' }}
            onClick={props.cancel(props.history, props.video)}
          >
            Cancel
          </Button>
          <Button
            style={{ color: 'black', backgroundColor: 'red', margin: '5px' }}
            onClick={props.toggleDelete}
          >
            Delete
          </Button>
        </div>
        <Dialog
          open={props.video.toggleDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Are you sure you want to delete this video?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Confirm Delete
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.toggleDelete}>Cancel</Button>
            <Button
              onClick={() => props.deleteVideo(props.video._id, props.history)}
              style={{ color: 'red' }}
              autoFocus
            >
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    video: state.video,
    videos: state.videos,
    newTag: state.newTag
  }
}

const mapActionsToProps = dispatch => {
  const doDispatch = (field, value) => {
    dispatch({ type: CHANGE_PHOTO, payload: value })
  }
  return {
    onChange: (field, value) => dispatch(editVideoField(field, value)),
    onSubmit: (history, video) => e => {
      e.preventDefault()
      dispatch(editVideo(history, video))
    },
    cancel: (history, video) => e => dispatch(cancelEdit(history, video)),
    toggleDelete: () => dispatch({ type: TOGGLE_DELETE }),
    deleteVideo: (id, history) => {
      dispatch({ type: TOGGLE_DELETE })
      dispatch(deleteVideo(id, history))
    },
    handleClick: (category, chip) => {
      dispatch({
        type: EDIT_FORM_ADD_CHIP,
        payload: { title: category, chip: chip }
      })
    },
    handleDelete: (category, chip) => {
      dispatch({
        type: EDIT_FORM_DELETE_CHIP,
        payload: { title: category, chip: chip }
      })
    },
    retry: (history, id) => e => {
      dispatch(getVideo(id))
    },
    createTag: tag => e => {
      dispatch({
        type: CREATE_TAG,
        payload: tag
      })
      dispatch({ type: CLEAR_NEW_TAG })
    },
    newTagText: (category, value) => {
      dispatch({
        type: NEW_TAG_TEXT,
        payload: { tags: [{ title: category, chips: [value] }] }
      })
    },
    handlePhoto: (e, results) => {
      const blob = compose(path(['target', 'result']), head, head)(results)
      doDispatch('PHOTO', blob)
    }
  }
}

const connector = connect(mapStateToProps, mapActionsToProps)

export default connector(withStyles(styles)(EditVideo))
