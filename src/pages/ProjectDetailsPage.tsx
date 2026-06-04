import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../design-system'
import type { ProjectDetails, Resource } from '../types/resource'
import { canEditProjectDetails, isDraft } from '../features/resources/rules'
import { validateProjectDetails } from '../features/resources/validation'
import { ProjectDetailsForm } from '../features/resources/forms/ProjectDetailsForm'
import { ModuleEditorShell } from '../features/resources/components/ModuleEditorShell'
import { ResourceLoader } from '../features/resources/components/ResourceLoader'
import { StateMessage } from '../components/feedback/StateMessage'
import { useModuleEditor } from '../features/resources/hooks/useModuleEditor'
import {
  useReplaceResource,
  useUpdateProjectDetails,
} from '../features/resources/hooks/useResourceMutations'

export function ProjectDetailsPage() {
  const { resourceId } = useParams()
  return (
    <ResourceLoader id={resourceId}>
      {(resource) => (
        <ProjectDetailsGate key={resource.updatedAt} resource={resource} />
      )}
    </ResourceLoader>
  )
}

function ProjectDetailsGate({ resource }: { resource: Resource }) {
  const navigate = useNavigate()
  const id = String(resource.resourceId)

  if (isDraft(resource) && !canEditProjectDetails(resource)) {
    return (
      <StateMessage
        title="Complete Basic Info first"
        description="Project Details becomes available once the Basic Info module is completed."
        action={
          <Button
            type="button"
            onClick={() => navigate(`/resources/${id}/basic-info`)}
          >
            Go to Basic Info
          </Button>
        }
      />
    )
  }

  return <ProjectDetailsEditor resource={resource} />
}

function ProjectDetailsEditor({ resource }: { resource: Resource }) {
  const navigate = useNavigate()
  const id = String(resource.resourceId)
  const draft = isDraft(resource)

  const editor = useModuleEditor<ProjectDetails>({
    isDraft: draft,
    serverValue: resource.projectDetails,
    validate: validateProjectDetails,
    toReplacePayload: (values) => ({
      name: resource.name,
      basicInfo: resource.basicInfo,
      projectDetails: values,
    }),
    patchMutation: useUpdateProjectDetails(id),
    replaceMutation: useReplaceResource(id),
  })

  const goToOverview = () => navigate(`/resources/${id}`)

  return (
    <ModuleEditorShell
      resource={resource}
      title="Project Details"
      isDirty={editor.isDirty}
      isSaving={editor.isSaving}
      canSave={editor.isDirty}
      submitError={editor.submitError}
      saveLabel={draft ? 'Save Project Details' : 'Submit changes'}
      onSave={() => editor.submit(goToOverview)}
      onCancel={goToOverview}
    >
      <ProjectDetailsForm
        values={editor.values}
        errors={editor.errors}
        disabled={editor.isSaving}
        onChange={editor.setField}
      />
    </ModuleEditorShell>
  )
}
