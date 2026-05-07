import CollapsibleGroup from "../../sub-components/CollapsibleGroup";
import { Props } from "./types";

export function CollapsibleContent({
  title,
  description,
  defaultOpen = false,
}: Props) {
  return (
    <div className="kombos-collapsible-content">
      <CollapsibleGroup title={title} defaultOpen={defaultOpen}>
        {description && (
          <div
            className="kombos-collapsible-content__body text-sm-regular kombos-richtext"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </CollapsibleGroup>
    </div>
  );
}

export default CollapsibleContent;
