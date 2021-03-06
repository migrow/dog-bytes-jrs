import React from 'react'
import MenuAppBar from '../../components/MenuAppBar'
import { TOGGLE_EXPANDED } from '../../constants'
import { connect } from 'react-redux'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import { getVideo } from '../../action-creators/videos'
import { withStyles } from 'material-ui/styles'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Collapse from 'material-ui/transitions/Collapse'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import FavoriteIcon from 'material-ui-icons/Favorite'
import ShareIcon from 'material-ui-icons/Share'
import EditIcon from 'material-ui-icons/Edit'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Divider from 'material-ui/Divider'
import classnames from 'classnames'
import { join, flatten, map, propOr, contains } from 'ramda'
import { toggleFavorite } from '../../action-creators/favorites'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Tooltip from 'material-ui/Tooltip'

const styles = theme => ({
  card: {
    maxWidth: 'flex'
  },
  media: {
    height: 194
  },
  actions: {
    display: 'flex'
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: 'auto'
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  image: {
    height: 20
  }
})

class VideoFavorite extends React.Component {
  componentDidMount() {
    const id = this.props.match.params.id
    this.props.getVideo(id)
  }

  render() {
    const props = this.props
    const { classes } = props

    return (
      <div>
        <center>
          <MenuAppBar
            {...props}
            showBackArrow={true}
            title="Video"
            navigateBack={e => props.navigateBack(props.history)}
          />
        </center>
        <ReactPlayer
          url={props.video.youTubeVideoURL}
          width="flex"
          height="300px"
          controls={true}
          style={{ paddingTop: '20px', paddingBottom: '15px' }}
        />
        <Card className={classes.card}>
          <CardHeader title={props.video.name} subheader={props.video.date} />
          <CardContent>
            <Typography component="p">{props.video.desc}</Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <Tooltip id="favorite" title="Favorite" placement="top">
              <IconButton
                onClick={props.toggleFavorite}
                aria-label="Add to favorites"
                style={{ color: props.favorites ? 'red' : null }}
              >
                <FavoriteIcon />
              </IconButton>
            </Tooltip>
            <CopyToClipboard text={props.video.youTubeVideoURL}>
              <Tooltip id="copy-url" title="Copy Url" placement="top">
                <IconButton aria-label="Share">
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </CopyToClipboard>
            <Link to={`/videos/${props.video._id}/edit`}>
              <Tooltip id="edit-video" title="Edit" placement="top">
                <IconButton aria-label="Edit Video">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Link>

            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: props.expanded.toggleExpanded
              })}
              onClick={props.handleExpandClick}
              aria-expanded={props.expanded}
              aria-label="Show more"
            >
              <Tooltip id="show-more" title="More Info" placement="top">
                <ExpandMoreIcon />
              </Tooltip>
            </IconButton>
          </CardActions>
          <Collapse
            in={props.expanded.toggleExpanded}
            timeout="auto"
            unmountOnExit
          >
            <CardContent>
              <Divider />
              <br />
              <Typography paragraph>
                Instructor: {props.video.instructor}
              </Typography>
              <Divider />
              <br />
              <Typography paragraph>
                Tags:{' '}
                {join(
                  ', ',
                  flatten(
                    map(tag => tag.chips)(propOr([], ['tags'], props.video))
                  )
                )}
              </Typography>
              <Divider />
              <br />
              <Typography>Notes: {props.video.notes}</Typography>
            </CardContent>
          </Collapse>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    video: state.video,
    expanded: state.toggleExpanded,
    favorites: contains(state.video._id, state.favorites)
  }
}

const mapActionsToProps = dispatch => {
  return {
    getVideo: id => dispatch(getVideo(id)),
    handleExpandClick: () => dispatch({ type: TOGGLE_EXPANDED }),
    toggleFavorite: () => {
      dispatch(toggleFavorite)
    },
    navigateBack: history => history.push('/videos/favorites')
  }
}

const connector = connect(mapStateToProps, mapActionsToProps)

export default connector(withStyles(styles)(VideoFavorite))
