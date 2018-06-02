import React from 'react';
import {compose, mapProps, withStateHandlers} from 'recompose';
import {cloneObjectWithoutKeys} from '../../helpers/OBject';

//HOCs
import WithStateHandlersComponent from '../highOrderComponents/WithStateHandlersComponent';
import SingleTransitionComponent from '../highOrderComponents/SingleTransitionComponent';
import CSSTransition from '../factories/CSSTransition';
import TransitionBetweenComponent from '../highOrderComponents/TransitionBetweenComponent';
import TransitionChildrenWithComponent from '../highOrderComponents/TransitionChildrenWithComponent';
import TransitionHeightToContentsComponent from '../highOrderComponents/TransitionHeightToContentsComponent';


//Transition components
export const FadeTransition = CSSTransition('fade');
export const FadeDisplayTransition = CSSTransition('fadeBlkDsp');

const VerticalSlide = compose(
  WithStateHandlersComponent(
    {
      contentHeight: null,
      style: null
    },
    {
      setContentHeight: () => (contentHeight) => ({contentHeight}),
      setStyle: () => (style) => ({style})
    }
  ),
  mapProps(({contentHeight, setContentHeight, style, setStyle, componentProps, ...rest}) => {
    return {
      ...rest,
      onEnter: (node, appearing) => {
        setContentHeight(node.clientHeight);
        setStyle({height: 0});

        rest.onEnter && rest.onEnter(node, appearing);
      },
      onEntering: (node, appearing) => {
        setStyle({height: `${contentHeight}px`})

        rest.onEntering && rest.onEntering(node, appearing);
      },
      onEntered: (node, appearing) => {
        setStyle({height: 'auto'});

        rest.onEntered && rest.onEntered(node, appearing);
      },
      onExit: (node) => {
        setStyle({height: `${node.clientHeight}px`});

        rest.onExit && rest.onExit(node);
      },
      onExiting: (node) => {
        setStyle({height: 0});

        rest.onExiting && rest.onExiting(node);
      },
      onExited: (node) => {
        setStyle({height: 'auto'});

        rest.onExited && rest.onExited(node);
      },
      componentProps: {
        ...componentProps,
        style
      }
    }
  })
)

//Vertical slide transitions only work with block, inline-block elements
export const FadeAndVerticalSlideTransition = VerticalSlide(CSSTransition('fadeAndVerticalSlide'));
export const FadeThenVerticalSlideTransition = VerticalSlide(CSSTransition('fadeThenVerticalSlide', {enter: 0.5, exit: 0.5}));
export const VerticalSlideTransition = VerticalSlide(CSSTransition('verticalSlide'));


//Single transition components
export const SingleFadeTransition = SingleTransitionComponent()(FadeTransition);
export const SingleVerticalSlideTransition = SingleTransitionComponent()(VerticalSlideTransition);
export const SingleFadeAndVerticalSlideTransition = SingleTransitionComponent()(FadeAndVerticalSlideTransition);
export const SingleFadeThenVerticalSlideTransition = SingleTransitionComponent()(FadeThenVerticalSlideTransition);


//Transition children with
export const TransitionChildrenWithFade = TransitionChildrenWithComponent()(FadeTransition);
export const TransitionChildrenWithFadeThenVerticalSlide = TransitionChildrenWithComponent()(FadeThenVerticalSlideTransition);
export const TransitionChildrenWithFadeAndVerticalSlide = TransitionChildrenWithComponent()(FadeAndVerticalSlideTransition);

//Transition between
const matchHeightsAndTransitionBetween = compose(
  /*withStateHandlers({
      disable: false
    },
    {
      setIsTransitioning: (state) => (isTransitioning) => {
        //console.log('setIsTransitioning: ', isTransitioning, state.disable);
        return {
          disable: !isTransitioning
        }
      }
    }
  ),*/
  //TransitionHeightToContentsComponent(),
  TransitionBetweenComponent()
);


//export const FadeTransitionBetween = TransitionBetweenComponent()(FadeTransition)
//export const FadeThenVerticalSlideTransitionBetween = matchHeightsAndTransitionBetween(FadeTransition)
//export const FadeAndVerticalSlideTransitionBetween = matchHeightsAndTransitionBetween(FadeTransition)

export const FadeTransitionBetween = matchHeightsAndTransitionBetween(FadeTransition)
