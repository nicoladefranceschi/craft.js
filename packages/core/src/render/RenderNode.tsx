import React, { useMemo } from 'react';

import { SimpleElement } from './SimpleElement';

import { useInternalEditor } from '../editor/useInternalEditor';
import { NodeId } from '../interfaces';
import { NodeElement } from '../nodes/NodeElement';
import { useInternalNode } from '../nodes/useInternalNode';

const Render = (otherProps: any) => {
  const { type, props: nodeProps, nodes, hydrationTimestamp } = useInternalNode(
    (node) => ({
      type: node.data.type,
      props: node.data.props,
      nodes: node.data.nodes,
      hydrationTimestamp: node._hydrationTimestamp,
    })
  );

  const props = {
    ...nodeProps,
    ...otherProps,
  };

  return useMemo(() => {
    let children = props.children;

    if (nodes && nodes.length > 0) {
      children = nodes.map((id: NodeId) => <NodeElement id={id} key={id} />);
    }

    const render = React.createElement(type, props, children);

    if (typeof type == 'string') {
      return <SimpleElement render={render} />;
    }

    return render;
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [type, props, hydrationTimestamp, nodes]);
};

export const RenderNodeToElement: React.FC<any> = (props) => {
  const { hidden } = useInternalNode((node) => ({
    hidden: node.data.hidden,
  }));

  const { onRender } = useInternalEditor((state) => ({
    onRender: state.options.onRender,
  }));

  // don't display the node since it's hidden
  if (hidden) {
    return null;
  }

  return React.createElement(onRender, { render: <Render {...props} /> });
};
